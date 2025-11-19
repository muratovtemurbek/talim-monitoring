from rest_framework import serializers
from .models import Video


class VideoSerializer(serializers.ModelSerializer):
    """Video serializer"""
    teacher_name = serializers.SerializerMethodField()
    subject_display = serializers.CharField(source='get_subject_display', read_only=True)

    class Meta:
        model = Video
        fields = [
            'id', 'teacher', 'teacher_name', 'title', 'description',
            'subject', 'subject_display', 'grade', 'video_url', 'video_file',
            'thumbnail', 'duration', 'is_approved', 'views', 'likes', 'created_at'
        ]
        read_only_fields = ['id', 'teacher', 'is_approved', 'views', 'likes', 'created_at']

    def get_teacher_name(self, obj):
        return obj.teacher.user.get_full_name()