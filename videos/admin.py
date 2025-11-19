from django.contrib import admin
from .models import Video


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ['title', 'teacher', 'subject', 'grade', 'is_approved', 'views', 'likes', 'created_at']
    list_filter = ['subject', 'grade', 'is_approved']
    search_fields = ['title', 'description']
    raw_id_fields = ['teacher']
    actions = ['approve_videos']

    def approve_videos(self, request, queryset):
        queryset.update(is_approved=True)
        self.message_user(request, f"{queryset.count()} ta video tasdiqlandi")

    approve_videos.short_description = "Tanlangan videolarni tasdiqlash"