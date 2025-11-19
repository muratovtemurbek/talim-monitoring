from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Teacher, TeacherActivity
from .serializers import (
    TeacherSerializer,
    TeacherActivitySerializer,
    TeacherCreateSerializer
)


class TeacherViewSet(viewsets.ModelViewSet):
    """O'qituvchilar CRUD"""
    queryset = Teacher.objects.select_related('user', 'school').all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return TeacherCreateSerializer
        return TeacherSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            # Admin faqat o'z maktabidagi o'qituvchilarni ko'radi
            return Teacher.objects.filter(school__director=user)
        return Teacher.objects.all()

    @action(detail=False, methods=['get'])
    def my_profile(self, request):
        """O'qituvchining o'z profili"""
        try:
            teacher = Teacher.objects.get(user=request.user)
            serializer = self.get_serializer(teacher)
            return Response(serializer.data)
        except Teacher.DoesNotExist:
            return Response(
                {'error': 'O\'qituvchi profili topilmadi'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def top_teachers(self, request):
        """Top o'qituvchilar"""
        limit = request.query_params.get('limit', 10)
        teachers = Teacher.objects.order_by('-total_points')[:int(limit)]
        serializer = self.get_serializer(teachers, many=True)
        return Response(serializer.data)


class TeacherActivityViewSet(viewsets.ModelViewSet):
    """Faoliyatlar CRUD"""
    queryset = TeacherActivity.objects.select_related('teacher').all()
    serializer_class = TeacherActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        try:
            teacher = Teacher.objects.get(user=user)
            return TeacherActivity.objects.filter(teacher=teacher)
        except Teacher.DoesNotExist:
            return TeacherActivity.objects.none()

    @action(detail=False, methods=['get'])
    def my_activities(self, request):
        """Mening faoliyatlarim"""
        activities = self.get_queryset()
        serializer = self.get_serializer(activities, many=True)
        return Response(serializer.data)