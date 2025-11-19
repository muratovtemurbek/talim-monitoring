from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LessonAnalysisViewSet

router = DefaultRouter()
router.register(r'', LessonAnalysisViewSet, basename='lesson-analysis')

urlpatterns = [
    path('', include(router.urls)),
]