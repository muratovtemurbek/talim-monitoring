from django.contrib import admin
from .models import ChatHistory


@admin.register(ChatHistory)
class ChatHistoryAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_at']
    list_filter = ['created_at']
    search_fields = ['message', 'response']
    raw_id_fields = ['user']
    readonly_fields = ['created_at']