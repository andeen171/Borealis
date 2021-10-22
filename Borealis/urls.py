from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('frontend.urls')),
    path('api/auth/', include('api_auth.urls')),
    path('api/', include('api_main.urls')),
]
