from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Django Admin
    path('admin/', admin.site.urls),
    
    # JWT Authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # API Endpoints
    path('api/auth/', include('users.urls')),
    path('api/schools/', include('schools.urls')),
    path('api/teachers/', include('teachers.urls')),
    path('api/materials/', include('materials.urls')),
    path('api/videos/', include('videos.urls')),
    path('api/consultations/', include('consultations.urls')),
    path('api/library/', include('library.urls')),
    path('api/ratings/', include('ratings.urls')),
    path('api/ai/', include('ai_assistant.urls')),
    path('api/lesson-analysis/', include('lesson_analysis.urls')),
    path('api/', include('mock_tests.urls')),
]

# Media va Static files
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)