from rest_framework import serializers
from .models import LibraryResource


class LibraryResourceSerializer(serializers.ModelSerializer):
    """Kutubxona serializer"""
    resource_type_display = serializers.CharField(source='get_resource_type_display', read_only=True)

    class Meta:
        model = LibraryResource
        fields = [
            'id', 'title', 'author', 'description', 'resource_type',
            'resource_type_display', 'file', 'url', 'cover_image',
            'views', 'created_at'
        ]
        read_only_fields = ['id', 'views', 'created_at']