from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MockTestViewSet

router = DefaultRouter()
router.register(r'mock-tests', MockTestViewSet, basename='mock-tests')

urlpatterns = [
    path('', include(router.urls)),
]