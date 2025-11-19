from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatHistoryViewSet

router = DefaultRouter()
router.register(r'', ChatHistoryViewSet, basename='chat')

urlpatterns = [
    path('', include(router.urls)),
]