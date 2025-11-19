from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import ChatHistory
from .serializers import ChatHistorySerializer, ChatRequestSerializer


class ChatHistoryViewSet(viewsets.ModelViewSet):
    """AI Suhbat tarixi"""
    serializer_class = ChatHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ChatHistory.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def ask(self, request):
        """AI ga savol berish"""
        serializer = ChatRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        message = serializer.validated_data['message']

        # AI javob (demo - keyinchalik real AI ulanadi)
        response_text = f"Sizning savolingiz: '{message}'. Bu demo javob. Keyinchalik real AI integratsiya qilinadi."

        # Suhbat tarixini saqlash
        chat = ChatHistory.objects.create(
            user=request.user,
            message=message,
            response=response_text
        )

        return Response({
            'message': message,
            'response': response_text,
            'id': chat.id
        })