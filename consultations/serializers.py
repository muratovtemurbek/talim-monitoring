from rest_framework import serializers
from .models import Consultation


class ConsultationSerializer(serializers.ModelSerializer):
    """Maslahat serializer"""
    teacher_name = serializers.SerializerMethodField()
    student_name = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    type_display = serializers.CharField(source='get_consultation_type_display', read_only=True)
    # Frontend uchun qo'shimcha fieldlar
    topic = serializers.CharField(source='title', read_only=True)
    type = serializers.CharField(source='consultation_type', read_only=True)
    date = serializers.SerializerMethodField()
    time = serializers.SerializerMethodField()

    class Meta:
        model = Consultation
        fields = [
            'id', 'title', 'topic', 'description', 'teacher', 'teacher_name',
            'student', 'student_name', 'scheduled_at', 'date', 'time',
            'duration', 'consultation_type', 'type', 'type_display',
            'location', 'meeting_url', 'status', 'status_display',
            'notes', 'created_at'
        ]
        read_only_fields = ['id', 'student', 'status', 'created_at']

    def get_teacher_name(self, obj):
        return obj.teacher.user.get_full_name()

    def get_student_name(self, obj):
        return obj.student.user.get_full_name()

    def get_date(self, obj):
        if obj.scheduled_at:
            return obj.scheduled_at.strftime('%Y-%m-%d')
        return None

    def get_time(self, obj):
        if obj.scheduled_at:
            return obj.scheduled_at.strftime('%H:%M')
        return None


class ConsultationCreateSerializer(serializers.ModelSerializer):
    """Maslahat yaratish serializer"""

    class Meta:
        model = Consultation
        fields = [
            'title', 'description', 'teacher', 'scheduled_at',
            'duration', 'consultation_type', 'location', 'notes'
        ]

    def validate_teacher(self, value):
        """O'ziga maslahat so'rash mumkin emas"""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            from teachers.models import Teacher
            try:
                student = Teacher.objects.get(user=request.user)
                if student == value:
                    raise serializers.ValidationError("O'zingizga maslahat so'ra olmaysiz")
            except Teacher.DoesNotExist:
                pass
        return value