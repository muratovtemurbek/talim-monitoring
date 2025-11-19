from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Video
from .serializers import VideoSerializer
from teachers.models import Teacher


class VideoViewSet(viewsets.ModelViewSet):
    """Videolar CRUD"""
    queryset = Video.objects.select_related('teacher').all()
    serializer_class = VideoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Video.objects.all()
        user = self.request.user

        if user.role == 'admin':
            queryset = queryset.filter(teacher__school__director=user)

        if user.role == 'teacher':
            try:
                teacher = Teacher.objects.get(user=user)
                queryset = queryset.filter(is_approved=True) | queryset.filter(teacher=teacher)
            except Teacher.DoesNotExist:
                queryset = queryset.filter(is_approved=True)

        return queryset

    def perform_create(self, serializer):
        """Video yaratish"""
        teacher = Teacher.objects.get(user=self.request.user)
        serializer.save(teacher=teacher)

    @action(detail=False, methods=['get'])
    def my_videos(self, request):
        """Mening videolarim"""
        teacher = Teacher.objects.get(user=request.user)
        videos = Video.objects.filter(teacher=teacher)
        serializer = self.get_serializer(videos, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Video tasdiqlash (Admin)"""
        if request.user.role != 'admin':
            return Response(
                {'error': 'Faqat admin tasdiqlashi mumkin'},
                status=status.HTTP_403_FORBIDDEN
            )

        video = self.get_object()
        video.is_approved = True
        video.save()

        # Ball qo'shish
        video.teacher.total_points += 15
        video.teacher.monthly_points += 15
        video.teacher.update_level()

        return Response({'message': 'Video tasdiqlandi'})

    @action(detail=True, methods=['post'])
    def increment_view(self, request, pk=None):
        """Ko'rish sonini oshirish"""
        video = self.get_object()
        video.views += 1
        video.save()
        return Response({'views': video.views})

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        """Like qo'shish"""
        video = self.get_object()
        video.likes += 1
        video.save()
        return Response({'likes': video.likes})