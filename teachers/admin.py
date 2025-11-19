from django.contrib import admin
from .models import Teacher, TeacherActivity


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ['user', 'school', 'subject', 'level', 'total_points', 'monthly_points']
    list_filter = ['level', 'subject', 'school']
    search_fields = ['user__username', 'user__first_name', 'user__last_name']
    raw_id_fields = ['user', 'school']


@admin.register(TeacherActivity)
class TeacherActivityAdmin(admin.ModelAdmin):
    list_display = ['teacher', 'activity_type', 'title', 'points', 'date']
    list_filter = ['activity_type', 'date']
    search_fields = ['title', 'description']
    raw_id_fields = ['teacher']