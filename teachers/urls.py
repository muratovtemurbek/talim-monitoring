from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeacherViewSet, TeacherActivityViewSet

router = DefaultRouter()
router.register(r'teachers', TeacherViewSet, basename='teacher')
router.register(r'activities', TeacherActivityViewSet, basename='activity')

urlpatterns = [
    path('', include(router.urls)),
]