from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Serializador JWT personalizado que incluye la información institucional
    del usuario en el payload del token y en la respuesta HTTP.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Claims personalizados en el JWT
        token['username'] = user.username
        token['email'] = user.email
        token['role'] = user.role
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Datos del usuario devueltos en la respuesta de login
        data['username'] = self.user.username
        data['email'] = self.user.email
        data['role'] = self.user.role
        data['first_name'] = self.user.first_name
        data['last_name'] = self.user.last_name
        data['departamento'] = self.user.departamento
        return data

class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializador para registrar nuevos usuarios con roles pre-asignados.
    """
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name', 'last_name', 'role', 'departamento', 'telefono')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data.get('role', 'ESTUDIANTE'),
            departamento=validated_data.get('departamento', ''),
            telefono=validated_data.get('telefono', '')
        )
        return user
