from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import LibraryResource
from .serializers import LibraryResourceSerializer


class LibraryResourceViewSet(viewsets.ModelViewSet):
    """Kutubxona CRUD"""
    queryset = LibraryResource.objects.all()
    serializer_class = LibraryResourceSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'])
    def increment_view(self, request, pk=None):
        """Ko'rish sonini oshirish"""
        resource = self.get_object()
        resource.views += 1
        resource.save()
        return Response({'views': resource.views})