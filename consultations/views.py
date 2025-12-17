from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Consultation
from .serializers import ConsultationSerializer, ConsultationCreateSerializer
from teachers.models import Teacher


class ConsultationViewSet(viewsets.ModelViewSet):
    """Maslahatlar CRUD"""
    queryset = Consultation.objects.select_related('teacher', 'student').all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return ConsultationCreateSerializer
        return ConsultationSerializer

    def get_queryset(self):
        user = self.request.user
        try:
            teacher = Teacher.objects.get(user=user)
            # O'qituvchi o'zi bergan va olgan maslahatlarni ko'radi
            return Consultation.objects.filter(teacher=teacher) | Consultation.objects.filter(student=teacher)
        except Teacher.DoesNotExist:
            return Consultation.objects.none()

    def create(self, request, *args, **kwargs):
        """Maslahat yaratish"""
        try:
            student = Teacher.objects.get(user=request.user)
        except Teacher.DoesNotExist:
            return Response(
                {"error": "O'qituvchi profili topilmadi. Admin bilan bog'laning."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(student=student)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def my_consultations(self, request):
        """Mening maslahatlarim"""
        consultations = self.get_queryset()
        serializer = self.get_serializer(consultations, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        """Maslahatni qabul qilish"""
        consultation = self.get_object()
        teacher = Teacher.objects.get(user=request.user)

        if consultation.teacher != teacher:
            return Response(
                {'error': 'Bu maslahat sizga tegishli emas'},
                status=status.HTTP_403_FORBIDDEN
            )

        consultation.status = 'accepted'
        consultation.save()

        return Response({'message': 'Maslahat qabul qilindi'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Maslahatni rad etish"""
        consultation = self.get_object()
        teacher = Teacher.objects.get(user=request.user)

        if consultation.teacher != teacher:
            return Response(
                {'error': 'Bu maslahat sizga tegishli emas'},
                status=status.HTTP_403_FORBIDDEN
            )

        consultation.status = 'rejected'
        consultation.save()

        return Response({'message': 'Maslahat rad etildi'})

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Maslahatni yakunlash"""
        consultation = self.get_object()
        consultation.status = 'completed'
        consultation.save()

        # Ball qo'shish
        consultation.teacher.total_points += 5
        consultation.teacher.monthly_points += 5
        consultation.teacher.update_level()

        return Response({'message': 'Maslahat yakunlandi'})