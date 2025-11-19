from rest_framework import serializers
from .models import Consultation


class ConsultationSerializer(serializers.ModelSerializer):
    """Maslahat serializer"""
    teacher_name = serializers.SerializerMethodField()
    student_name = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Consultation
        fields = [
            'id', 'title', 'description', 'teacher', 'teacher_name',
            'student', 'student_name', 'scheduled_at', 'status', 'status_display',
            'notes', 'created_at'
        ]
        read_only_fields = ['id', 'student', 'status', 'created_at']

    def get_teacher_name(self, obj):
        return obj.teacher.user.get_full_name()

    def get_student_name(self, obj):
        return obj.student.user.get_full_name()