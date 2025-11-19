from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LibraryResourceViewSet

router = DefaultRouter()
router.register(r'', LibraryResourceViewSet, basename='library')

urlpatterns = [
    path('', include(router.urls)),
]