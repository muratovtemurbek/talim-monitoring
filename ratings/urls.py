from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeacherRatingViewSet, SchoolRatingViewSet

router = DefaultRouter()
router.register(r'teachers', TeacherRatingViewSet, basename='teacher-rating')
router.register(r'schools', SchoolRatingViewSet, basename='school-rating')

urlpatterns = [
    path('', include(router.urls)),
]