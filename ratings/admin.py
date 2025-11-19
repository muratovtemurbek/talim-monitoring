from django.contrib import admin
from .models import TeacherRating, SchoolRating


@admin.register(TeacherRating)
class TeacherRatingAdmin(admin.ModelAdmin):
    list_display = ['teacher', 'month', 'total_points', 'rank']
    list_filter = ['month']
    raw_id_fields = ['teacher']


@admin.register(SchoolRating)
class SchoolRatingAdmin(admin.ModelAdmin):
    list_display = ['school', 'month', 'total_points', 'rank', 'teachers_count']
    list_filter = ['month']
    raw_id_fields = ['school']