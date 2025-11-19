from django.contrib import admin
from .models import School


@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = ['name', 'region', 'district', 'director', 'created_at']
    list_filter = ['region', 'district']
    search_fields = ['name', 'address']
    raw_id_fields = ['director']