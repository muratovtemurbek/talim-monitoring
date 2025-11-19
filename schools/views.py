from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import School
from .serializers import SchoolSerializer


class SchoolViewSet(viewsets.ModelViewSet):
    """Maktablar CRUD"""
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            # Admin faqat o'z maktabini ko'radi
            return School.objects.filter(director=user)
        return School.objects.all()