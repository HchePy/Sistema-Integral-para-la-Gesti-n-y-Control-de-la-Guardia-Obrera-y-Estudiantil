from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import CustomTokenObtainPairSerializer, UserRegistrationSerializer

User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Vista personalizada para inicio de sesión que retorna JWT con claims del rol de la UHO.
    """
    serializer_class = CustomTokenObtainPairSerializer

class UserRegistrationView(APIView):
    """
    Vista para el autoregistro o registro de personal de la universidad.
    """
    permission_classes = [permissions.AllowAny] # Registro libre para pruebas

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"detail": "Usuario registrado exitosamente en el sistema UHO."},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    """
    Retorna el perfil del usuario autenticado actualmente en la sesión.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "role_display": user.get_role_display(),
            "first_name": user.first_name,
            "last_name": user.last_name,
            "departamento": user.departamento,
            "telefono": user.telefono
        })
