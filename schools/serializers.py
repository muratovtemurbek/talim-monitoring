from rest_framework import serializers
from .models import School


class SchoolSerializer(serializers.ModelSerializer):
    """Maktab serializer"""
    director_name = serializers.SerializerMethodField()
    teachers_count = serializers.SerializerMethodField()

    class Meta:
        model = School
        fields = ['id', 'name', 'address', 'region', 'district', 'director', 'director_name', 'teachers_count',
                  'created_at']
        read_only_fields = ['id', 'created_at']

    def get_director_name(self, obj):
        return obj.director.get_full_name() if obj.director else None

    def get_teachers_count(self, obj):
        return obj.teachers.count()