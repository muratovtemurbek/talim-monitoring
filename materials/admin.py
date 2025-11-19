from django.contrib import admin
from .models import Material


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ['title', 'teacher', 'subject', 'grade', 'is_approved', 'views', 'downloads', 'created_at']
    list_filter = ['subject', 'grade', 'is_approved']
    search_fields = ['title', 'description']
    raw_id_fields = ['teacher']
    actions = ['approve_materials']

    def approve_materials(self, request, queryset):
        queryset.update(is_approved=True)
        self.message_user(request, f"{queryset.count()} ta material tasdiqlandi")

    approve_materials.short_description = "Tanlangan materiallarni tasdiqlash"