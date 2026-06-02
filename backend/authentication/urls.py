from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CustomTokenObtainPairView, UserRegistrationView, UserProfileView

urlpatterns = [
    # Inicio de sesión (Retorna Tokens de Acceso y Refresco JWT)
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # Refresco de Token JWT expirado
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Registro de un nuevo usuario
    path('register/', UserRegistrationView.as_view(), name='user_register'),
    
    # Obtener perfil del usuario actual autenticado
    path('profile/', UserProfileView.as_view(), name='user_profile'),
]
