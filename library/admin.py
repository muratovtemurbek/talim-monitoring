from django.contrib import admin
from .models import LibraryResource


@admin.register(LibraryResource)
class LibraryResourceAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'resource_type', 'views', 'created_at']
    list_filter = ['resource_type']
    search_fields = ['title', 'author', 'description']