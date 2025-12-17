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

    def create(self, request, *args, **kwargs):
        """Video yaratish"""
        try:
            teacher = Teacher.objects.get(user=request.user)
        except Teacher.DoesNotExist:
            return Response(
                {"error": "O'qituvchi profili topilmadi. Admin bilan bog'laning."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(teacher=teacher)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def my_videos(self, request):
        """Mening videolarim"""
        try:
            teacher = Teacher.objects.get(user=request.user)
            videos = Video.objects.filter(teacher=teacher)
            serializer = self.get_serializer(videos, many=True)
            return Response(serializer.data)
        except Teacher.DoesNotExist:
            return Response([], status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Video tasdiqlash (Admin)"""
        if request.user.role not in ['admin', 'superadmin']:
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
        video.teacher.save()

        return Response({'message': 'Video tasdiqlandi', 'points': 15})

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