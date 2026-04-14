from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from alumni.views import AlumniViewSet

router = DefaultRouter()
router.register(r'alumni', AlumniViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]