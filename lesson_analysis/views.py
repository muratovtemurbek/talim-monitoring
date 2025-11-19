from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg, Count, Q
from django.utils import timezone
from .models import LessonAnalysis, LessonAnalysisComment
from .serializers import (
    LessonAnalysisSerializer,
    LessonAnalysisCreateSerializer,
    LessonAnalysisCommentSerializer,
    LessonAnalysisStatsSerializer,
)
from teachers.models import Teacher


class LessonAnalysisViewSet(viewsets.ModelViewSet):
    """Dars tahlili CRUD"""
    queryset = LessonAnalysis.objects.select_related('analyzer', 'teacher').all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return LessonAnalysisCreateSerializer
        return LessonAnalysisSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = LessonAnalysis.objects.all()

        # Admin barcha tahlillarni ko'radi
        if user.role in ['admin', 'superadmin']:
            return queryset

        # O'qituvchi o'zi bergan va olgan tahlillarni ko'radi
        try:
            teacher = Teacher.objects.get(user=user)
            return queryset.filter(
                Q(analyzer=teacher) | Q(teacher=teacher)
            )
        except Teacher.DoesNotExist:
            return queryset.none()

    def perform_create(self, serializer):
        """Tahlil yaratish"""
        teacher = Teacher.objects.get(user=self.request.user)
        serializer.save(analyzer=teacher, status='draft')

    @action(detail=False, methods=['get'])
    def my_analyses_given(self, request):
        """Men bergan tahlillar"""
        teacher = Teacher.objects.get(user=request.user)
        analyses = LessonAnalysis.objects.filter(analyzer=teacher)
        serializer = self.get_serializer(analyses, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_analyses_received(self, request):
        """Menga berilgan tahlillar"""
        teacher = Teacher.objects.get(user=request.user)
        analyses = LessonAnalysis.objects.filter(teacher=teacher)
        serializer = self.get_serializer(analyses, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Tasdiqlash kutilayotgan tahlillar"""
        teacher = Teacher.objects.get(user=request.user)
        analyses = LessonAnalysis.objects.filter(
            teacher=teacher,
            status='pending'
        )
        serializer = self.get_serializer(analyses, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Tahlilni tasdiqlashga yuborish"""
        analysis = self.get_object()

        # Faqat tahlilchi yuborishi mumkin
        if analysis.analyzer.user != request.user:
            return Response(
                {'error': 'Faqat tahlilchi yuborishi mumkin'},
                status=status.HTTP_403_FORBIDDEN
            )

        if analysis.status != 'draft':
            return Response(
                {'error': 'Faqat qoralama tahlilni yuborish mumkin'},
                status=status.HTTP_400_BAD_REQUEST
            )

        analysis.status = 'pending'
        analysis.save()

        return Response({'message': 'Tahlil tasdiqlashga yuborildi'})

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Tahlilni tasdiqlash"""
        analysis = self.get_object()

        # Faqat dars o'tgan o'qituvchi tasdiqlashi mumkin
        if analysis.teacher.user != request.user:
            return Response(
                {'error': 'Faqat dars o\'tgan o\'qituvchi tasdiqlashi mumkin'},
                status=status.HTTP_403_FORBIDDEN
            )

        if analysis.status != 'pending':
            return Response(
                {'error': 'Faqat kutilayotgan tahlilni tasdiqlash mumkin'},
                status=status.HTTP_400_BAD_REQUEST
            )

        analysis.status = 'approved'
        analysis.approved_at = timezone.now()
        analysis.save()

        # Ball qo'shish
        analysis.teacher.total_points += 5
        analysis.teacher.monthly_points += 5
        analysis.analyzer.total_points += 10
        analysis.analyzer.monthly_points += 10
        analysis.teacher.update_level()
        analysis.analyzer.update_level()

        return Response({'message': 'Tahlil tasdiqlandi'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Tahlilni rad etish"""
        analysis = self.get_object()

        # Faqat dars o'tgan o'qituvchi rad etishi mumkin
        if analysis.teacher.user != request.user:
            return Response(
                {'error': 'Faqat dars o\'tgan o\'qituvchi rad etishi mumkin'},
                status=status.HTTP_403_FORBIDDEN
            )

        if analysis.status != 'pending':
            return Response(
                {'error': 'Faqat kutilayotgan tahlilni rad etish mumkin'},
                status=status.HTTP_400_BAD_REQUEST
            )

        reason = request.data.get('reason', '')
        analysis.status = 'rejected'
        analysis.rejection_reason = reason
        analysis.save()

        return Response({'message': 'Tahlil rad etildi'})

    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        """Izoh qo'shish"""
        analysis = self.get_object()
        comment_text = request.data.get('comment', '')

        if not comment_text:
            return Response(
                {'error': 'Izoh matnini kiriting'},
                status=status.HTTP_400_BAD_REQUEST
            )

        comment = LessonAnalysisComment.objects.create(
            analysis=analysis,
            user=request.user,
            comment=comment_text
        )

        serializer = LessonAnalysisCommentSerializer(comment)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Statistika"""
        user = request.user

        if user.role in ['admin', 'superadmin']:
            # Admin uchun umumiy statistika
            stats = {
                'total_analyses': LessonAnalysis.objects.count(),
                'pending_analyses': LessonAnalysis.objects.filter(status='pending').count(),
                'approved_analyses': LessonAnalysis.objects.filter(status='approved').count(),
                'average_rating': LessonAnalysis.objects.filter(
                    status='approved'
                ).aggregate(Avg('overall_rating'))['overall_rating__avg'] or 0,
                'total_given': 0,
                'total_received': 0,
            }
        else:
            # O'qituvchi uchun shaxsiy statistika
            teacher = Teacher.objects.get(user=user)
            stats = {
                'total_analyses': LessonAnalysis.objects.filter(
                    Q(analyzer=teacher) | Q(teacher=teacher)
                ).count(),
                'pending_analyses': LessonAnalysis.objects.filter(
                    teacher=teacher,
                    status='pending'
                ).count(),
                'approved_analyses': LessonAnalysis.objects.filter(
                    teacher=teacher,
                    status='approved'
                ).count(),
                'average_rating': LessonAnalysis.objects.filter(
                    teacher=teacher,
                    status='approved'
                ).aggregate(Avg('overall_rating'))['overall_rating__avg'] or 0,
                'total_given': LessonAnalysis.objects.filter(analyzer=teacher).count(),
                'total_received': LessonAnalysis.objects.filter(teacher=teacher).count(),
            }

        serializer = LessonAnalysisStatsSerializer(stats)
        return Response(serializer.data)