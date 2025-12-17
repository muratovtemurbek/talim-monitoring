from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q
from .models import Material
from .serializers import MaterialSerializer
from .filters import MaterialFilter
from teachers.models import Teacher
from utils.pagination import StandardResultsSetPagination


class MaterialViewSet(viewsets.ModelViewSet):
    """Materiallar CRUD"""
    queryset = Material.objects.select_related('teacher').all()
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

        # Superadmin hamma narsani ko'radi
        if user.role == 'superadmin':
            return queryset

        if user.role == 'admin':
            queryset = queryset.filter(teacher__school__director=user)
        elif user.role == 'teacher':
            try:
                teacher = Teacher.objects.get(user=user)
                queryset = queryset.filter(Q(is_approved=True) | Q(teacher=teacher))
            except Teacher.DoesNotExist:
                queryset = queryset.filter(is_approved=True)

        return queryset

    def create(self, request, *args, **kwargs):
        """Material yaratish"""
        # O'qituvchi profilini tekshirish
        try:
            teacher = Teacher.objects.get(user=request.user)
        except Teacher.DoesNotExist:
            return Response(
                {"error": "O'qituvchi profili topilmadi. Admin bilan bog'laning."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Serializer bilan validatsiya
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Saqlash
        serializer.save(teacher=teacher)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

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

    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Tasdiqlanmagan materiallar (Admin/Superadmin uchun)"""
        if request.user.role not in ['admin', 'superadmin']:
            return Response({'error': 'Ruxsat yo\'q'}, status=status.HTTP_403_FORBIDDEN)

        materials = self.get_queryset().filter(is_approved=False)

        page = self.paginate_queryset(materials)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(materials, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Material tasdiqlash (Admin/Superadmin)"""
        if request.user.role not in ['admin', 'superadmin']:
            return Response(
                {'error': 'Faqat admin tasdiqlashi mumkin'},
                status=status.HTTP_403_FORBIDDEN
            )

        material = self.get_object()

        if material.is_approved:
            return Response({'message': 'Material allaqachon tasdiqlangan'})

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
        """Material rad etish (Admin/Superadmin)"""
        if request.user.role not in ['admin', 'superadmin']:
            return Response(
                {'error': 'Faqat admin rad etishi mumkin'},
                status=status.HTTP_403_FORBIDDEN
            )

        material = self.get_object()
        reason = request.data.get('reason', 'Sabab ko\'rsatilmagan')
        material.delete()

        return Response({'message': 'Material rad etildi', 'reason': reason})

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