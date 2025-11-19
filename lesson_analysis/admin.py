from django.contrib import admin
from .models import LessonAnalysis, LessonAnalysisComment


@admin.register(LessonAnalysis)
class LessonAnalysisAdmin(admin.ModelAdmin):
    list_display = [
        'teacher',
        'analyzer',
        'lesson_date',
        'subject',
        'grade',
        'overall_rating',
        'status',
        'created_at'
    ]
    list_filter = ['status', 'lesson_date', 'subject', 'grade']
    search_fields = ['teacher__user__first_name', 'analyzer__user__first_name', 'topic']
    raw_id_fields = ['analyzer', 'teacher']
    readonly_fields = ['overall_rating', 'created_at', 'updated_at']

    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': ('analyzer', 'teacher', 'status')
        }),
        ('Dars haqida', {
            'fields': ('lesson_date', 'subject', 'grade', 'topic', 'lesson_type')
        }),
        ('Baholash', {
            'fields': (
                'methodology_rating',
                'material_mastery',
                'student_engagement',
                'time_management',
                'technology_use',
                'overall_rating'
            )
        }),
        ('Tahlil', {
            'fields': ('achievements', 'weaknesses', 'recommendations')
        }),
        ('Qo\'shimcha', {
            'fields': ('notes', 'attachments', 'rejection_reason', 'approved_at')
        }),
        ('Vaqt', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(LessonAnalysisComment)
class LessonAnalysisCommentAdmin(admin.ModelAdmin):
    list_display = ['analysis', 'user', 'created_at']
    list_filter = ['created_at']
    search_fields = ['comment']
    raw_id_fields = ['analysis', 'user']