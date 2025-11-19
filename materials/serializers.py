from rest_framework import serializers
from .models import Material


class MaterialSerializer(serializers.ModelSerializer):
    """Material serializer"""
    teacher_name = serializers.SerializerMethodField()
    subject_display = serializers.CharField(source='get_subject_display', read_only=True)

    class Meta:
        model = Material
        fields = [
            'id', 'teacher', 'teacher_name', 'title', 'description',
            'subject', 'subject_display', 'grade', 'file',
            'is_approved', 'views', 'downloads', 'created_at'
        ]
        read_only_fields = ['id', 'teacher', 'is_approved', 'views', 'downloads', 'created_at']

    def get_teacher_name(self, obj):
        return obj.teacher.user.get_full_name()