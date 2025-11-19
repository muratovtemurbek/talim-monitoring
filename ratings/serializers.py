from rest_framework import serializers
from .models import TeacherRating, SchoolRating


class TeacherRatingSerializer(serializers.ModelSerializer):
    """O'qituvchi reyting serializer"""
    teacher_name = serializers.SerializerMethodField()
    school_name = serializers.SerializerMethodField()

    class Meta:
        model = TeacherRating
        fields = ['id', 'teacher', 'teacher_name', 'school_name', 'month', 'total_points', 'rank']
        read_only_fields = ['id']

    def get_teacher_name(self, obj):
        return obj.teacher.user.get_full_name()

    def get_school_name(self, obj):
        return obj.teacher.school.name


class SchoolRatingSerializer(serializers.ModelSerializer):
    """Maktab reyting serializer"""
    school_name = serializers.CharField(source='school.name', read_only=True)

    class Meta:
        model = SchoolRating
        fields = ['id', 'school', 'school_name', 'month', 'total_points', 'rank', 'teachers_count']
        read_only_fields = ['id']