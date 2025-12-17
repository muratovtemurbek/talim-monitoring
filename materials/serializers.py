from rest_framework import serializers
from .models import Material


class MaterialSerializer(serializers.ModelSerializer):
    teacher_name = serializers.SerializerMethodField(read_only=True)
    school_name = serializers.SerializerMethodField(read_only=True)
    subject_display = serializers.CharField(source='get_subject_display', read_only=True)

    class Meta:
        model = Material
        fields = [
            'id', 'teacher', 'teacher_name', 'school_name',
            'title', 'description', 'subject', 'subject_display',
            'grade', 'file', 'is_approved', 'views', 'downloads',
            'created_at'
        ]
        read_only_fields = [
            'id', 'teacher', 'teacher_name', 'school_name',
            'subject_display', 'views', 'downloads',
            'is_approved', 'created_at'
        ]

    def get_teacher_name(self, obj):
        try:
            return f"{obj.teacher.user.first_name} {obj.teacher.user.last_name}"
        except:
            return 'N/A'

    def get_school_name(self, obj):
        try:
            return obj.teacher.school.name
        except:
            return 'N/A'