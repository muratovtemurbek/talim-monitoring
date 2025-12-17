from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


def api_root(request):
    """API Root - Ma'lumot sahifasi"""
    return JsonResponse({
        'name': 'Ta\'lim Monitoring API',
        'version': '1.0.0',
        'status': 'running',
        'endpoints': {
            'admin': '/admin/',
            'auth': '/api/auth/',
            'token': '/api/token/',
            'token_refresh': '/api/token/refresh/',
            'schools': '/api/schools/',
            'teachers': '/api/teachers/',
            'materials': '/api/materials/',
            'videos': '/api/videos/',
            'consultations': '/api/consultations/',
            'library': '/api/library/',
            'ratings': '/api/ratings/',
            'ai_assistant': '/api/ai/',
            'lesson_analysis': '/api/lesson-analysis/',
            'mock_tests': '/api/mock-tests/',
        },
        'documentation': 'API ishlayapti. Frontend ulanishi mumkin.',
    })


urlpatterns = [
    # Root URL - API Info
    path('', api_root, name='api_root'),

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