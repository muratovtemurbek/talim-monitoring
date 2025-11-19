from rest_framework import serializers
from .models import LessonAnalysis, LessonAnalysisComment


class LessonAnalysisCommentSerializer(serializers.ModelSerializer):
    """Izoh serializer"""
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = LessonAnalysisComment
        fields = ['id', 'analysis', 'user', 'user_name', 'comment', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

    def get_user_name(self, obj):
        return obj.user.get_full_name()


class LessonAnalysisSerializer(serializers.ModelSerializer):
    """Dars tahlili serializer"""
    analyzer_name = serializers.SerializerMethodField()
    teacher_name = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    comments = LessonAnalysisCommentSerializer(many=True, read_only=True)

    class Meta:
        model = LessonAnalysis
        fields = [
            'id', 'analyzer', 'analyzer_name', 'teacher', 'teacher_name',
            'lesson_date', 'subject', 'grade', 'topic', 'lesson_type',
            'methodology_rating', 'material_mastery', 'student_engagement',
            'time_management', 'technology_use',
            'achievements', 'weaknesses', 'recommendations',
            'overall_rating', 'status', 'status_display',
            'approved_at', 'rejection_reason', 'notes', 'attachments',
            'comments', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'analyzer', 'overall_rating', 'created_at', 'updated_at']

    def get_analyzer_name(self, obj):
        return obj.analyzer.user.get_full_name()

    def get_teacher_name(self, obj):
        return obj.teacher.user.get_full_name()


class LessonAnalysisCreateSerializer(serializers.ModelSerializer):
    """Tahlil yaratish"""

    class Meta:
        model = LessonAnalysis
        fields = [
            'teacher', 'lesson_date', 'subject', 'grade', 'topic', 'lesson_type',
            'methodology_rating', 'material_mastery', 'student_engagement',
            'time_management', 'technology_use',
            'achievements', 'weaknesses', 'recommendations',
            'notes', 'attachments'
        ]

    def validate(self, data):
        # Tahlilchi o'zini tahlil qila olmaydi
        request = self.context.get('request')
        if request and hasattr(request.user, 'teacher_profile'):
            if data['teacher'] == request.user.teacher_profile:
                raise serializers.ValidationError("O'zingizni tahlil qila olmaysiz!")
        return data


class LessonAnalysisStatsSerializer(serializers.Serializer):
    """Statistika serializer"""
    total_analyses = serializers.IntegerField()
    pending_analyses = serializers.IntegerField()
    approved_analyses = serializers.IntegerField()
    average_rating = serializers.DecimalField(max_digits=3, decimal_places=2)
    total_given = serializers.IntegerField()
    total_received = serializers.IntegerField()