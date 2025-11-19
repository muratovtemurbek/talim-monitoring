from rest_framework import serializers
from .models import Teacher, TeacherActivity


class TeacherSerializer(serializers.ModelSerializer):
    """O'qituvchi serializer"""
    user_name = serializers.SerializerMethodField()
    school_name = serializers.SerializerMethodField()
    subject_display = serializers.CharField(source='get_subject_display', read_only=True)
    level_display = serializers.CharField(source='get_level_display', read_only=True)

    class Meta:
        model = Teacher
        fields = [
            'id', 'user', 'user_name', 'school', 'school_name',
            'subject', 'subject_display', 'level', 'level_display',
            'total_points', 'monthly_points', 'bio', 'created_at'
        ]
        read_only_fields = ['id', 'total_points', 'monthly_points', 'level', 'created_at']

    def get_user_name(self, obj):
        return obj.user.get_full_name()

    def get_school_name(self, obj):
        return obj.school.name


class TeacherActivitySerializer(serializers.ModelSerializer):
    """Faoliyat serializer"""
    teacher_name = serializers.SerializerMethodField()

    class Meta:
        model = TeacherActivity
        fields = ['id', 'teacher', 'teacher_name', 'activity_type', 'title', 'description', 'points', 'date']
        read_only_fields = ['id', 'date']

    def get_teacher_name(self, obj):
        return obj.teacher.user.get_full_name()


class TeacherCreateSerializer(serializers.ModelSerializer):
    """O'qituvchi yaratish"""

    class Meta:
        model = Teacher
        fields = ['user', 'school', 'subject', 'bio']