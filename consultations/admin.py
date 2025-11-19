from django.contrib import admin
from .models import Consultation


@admin.register(Consultation)
class ConsultationAdmin(admin.ModelAdmin):
    list_display = ['title', 'teacher', 'student', 'scheduled_at', 'status', 'created_at']
    list_filter = ['status', 'scheduled_at']
    search_fields = ['title', 'description']
    raw_id_fields = ['teacher', 'student']