from django.urls import path
from .views import (
    AIAssistantView,
    AIChatHistoryView,
    AILessonPlanView,
    AITestGeneratorView,
)

urlpatterns = [
    path('chat/', AIAssistantView.as_view(), name='ai-chat'),
    path('history/', AIChatHistoryView.as_view(), name='ai-history'),
    path('lesson-plan/', AILessonPlanView.as_view(), name='ai-lesson-plan'),
    path('generate-test/', AITestGeneratorView.as_view(), name='ai-generate-test'),
]