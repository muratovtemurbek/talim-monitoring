from rest_framework import serializers
from .models import ChatHistory


class ChatHistorySerializer(serializers.ModelSerializer):
    """Suhbat tarixi serializer"""

    class Meta:
        model = ChatHistory
        fields = ['id', 'user', 'message', 'response', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


class ChatRequestSerializer(serializers.Serializer):
    """Chat so'rov serializer"""
    message = serializers.CharField(required=True)