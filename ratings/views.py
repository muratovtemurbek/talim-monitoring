from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import TeacherRating, SchoolRating
from .serializers import TeacherRatingSerializer, SchoolRatingSerializer


class TeacherRatingViewSet(viewsets.ReadOnlyModelViewSet):
    """O'qituvchilar reytingi"""
    queryset = TeacherRating.objects.select_related('teacher').all()
    serializer_class = TeacherRatingSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def top_teachers(self, request):
        """Top o'qituvchilar"""
        limit = request.query_params.get('limit', 10)
        ratings = TeacherRating.objects.order_by('rank')[:int(limit)]
        serializer = self.get_serializer(ratings, many=True)
        return Response(serializer.data)


class SchoolRatingViewSet(viewsets.ReadOnlyModelViewSet):
    """Maktablar reytingi"""
    queryset = SchoolRating.objects.select_related('school').all()
    serializer_class = SchoolRatingSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def top_schools(self, request):
        """Top maktablar"""
        limit = request.query_params.get('limit', 10)
        ratings = SchoolRating.objects.order_by('rank')[:int(limit)]
        serializer = self.get_serializer(ratings, many=True)
        return Response(serializer.data)