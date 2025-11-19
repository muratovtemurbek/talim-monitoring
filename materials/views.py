from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Material
from .serializers import MaterialSerializer
from .filters import MaterialFilter
from teachers.models import Teacher
from utils.pagination import StandardResultsSetPagination


class MaterialViewSet(viewsets.ModelViewSet):
    """Materiallar CRUD"""
    queryset = Material.objects.select_related('teacher').all()  # ✅ MUHIM!
    serializer_class = MaterialSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = MaterialFilter
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'views', 'downloads']

    def get_queryset(self):
        """Queryset ni filtr qilish"""
        queryset = Material.objects.select_related('teacher__user', 'teacher__school').all()
        user = self.request.user

        if user.role == 'admin':
            # Admin faqat o'z maktabi materiallarini ko'radi
            queryset = queryset.filter(teacher__school__director=user)
        elif user.role == 'teacher':
            # O'qituvchi o'zining va tasdiqlangan materiallarni ko'radi
            try:
                teacher = Teacher.objects.get(user=user)
                queryset = queryset.filter(is_approved=True) | queryset.filter(teacher=teacher)
            except Teacher.DoesNotExist:
                queryset = queryset.filter(is_approved=True)

        return queryset

    def perform_create(self, serializer):
        """Material yaratish"""
        try:
            teacher = Teacher.objects.get(user=self.request.user)
            serializer.save(teacher=teacher)
        except Teacher.DoesNotExist:
            raise ValueError("O'qituvchi profili topilmadi")

    @action(detail=False, methods=['get'])
    def my_materials(self, request):
        """Mening materiallarim"""
        try:
            teacher = Teacher.objects.get(user=request.user)
            materials = Material.objects.filter(teacher=teacher).select_related('teacher__user', 'teacher__school')

            page = self.paginate_queryset(materials)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(materials, many=True)
            return Response(serializer.data)
        except Teacher.DoesNotExist:
            return Response([], status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Material tasdiqlash (Admin)"""
        if request.user.role not in ['admin', 'superadmin']:
            return Response(
                {'error': 'Faqat admin tasdiqlashi mumkin'},
                status=status.HTTP_403_FORBIDDEN
            )

        material = self.get_object()

        if material.is_approved:
            return Response(
                {'error': 'Material allaqachon tasdiqlangan'},
                status=status.HTTP_400_BAD_REQUEST
            )

        material.is_approved = True
        material.save()

        # Ballarni qo'shish
        material.teacher.total_points += 10
        material.teacher.monthly_points += 10
        material.teacher.save()
        material.teacher.update_level()

        return Response({'message': 'Material tasdiqlandi', 'points_added': 10})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Material rad etish (Admin)"""
        if request.user.role not in ['admin', 'superadmin']:
            return Response(
                {'error': 'Faqat admin rad etishi mumkin'},
                status=status.HTTP_403_FORBIDDEN
            )

        material = self.get_object()
        reason = request.data.get('reason', 'Sabab ko\'rsatilmagan')

        material.delete()

        return Response({
            'message': 'Material rad etildi',
            'reason': reason
        })

    @action(detail=True, methods=['post'])
    def increment_view(self, request, pk=None):
        """Ko'rish sonini oshirish"""
        material = self.get_object()
        material.views += 1
        material.save(update_fields=['views'])
        return Response({'views': material.views})

    @action(detail=True, methods=['post'])
    def increment_download(self, request, pk=None):
        """Yuklab olish sonini oshirish"""
        material = self.get_object()
        material.downloads += 1
        material.save(update_fields=['downloads'])
        return Response({'downloads': material.downloads})


import django_filters
from .models import Material


class MaterialFilter(django_filters.FilterSet):
    subject = django_filters.ChoiceFilter(choices=Material.SUBJECT_CHOICES)
    grade = django_filters.NumberFilter()
    grade_min = django_filters.NumberFilter(field_name='grade', lookup_expr='gte')
    grade_max = django_filters.NumberFilter(field_name='grade', lookup_expr='lte')
    is_approved = django_filters.BooleanFilter()
    created_after = django_filters.DateFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateFilter(field_name='created_at', lookup_expr='lte')
    search = django_filters.CharFilter(field_name='title', lookup_expr='icontains')

    class Meta:
        model = Material
        fields = ['subject', 'grade', 'is_approved']