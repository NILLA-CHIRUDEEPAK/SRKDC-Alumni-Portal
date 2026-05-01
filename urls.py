from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# ADD THIS LINE BELOW
from accounts.views import AlumniListView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # This is the line that was causing the error
    path('api/alumni/', AlumniListView.as_view(), name='alumni-list'),
]