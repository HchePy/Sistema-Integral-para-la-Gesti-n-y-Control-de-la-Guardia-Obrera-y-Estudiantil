from django.db import models
from django.contrib.auth.models import AbstractUser
from core.rbac import ROLES_CHOICES, ROLE_ESTUDIANTE

class CustomUser(AbstractUser):
    """
    Modelo de Usuario Personalizado para la Universidad de Holguín.
    Soporta Roles institucionales para control de acceso (RBAC).
    """
    email = models.EmailField(unique=True, verbose_name='Correo Electrónico')
    role = models.CharField(
        max_length=50,
        choices=ROLES_CHOICES,
        default=ROLE_ESTUDIANTE,
        verbose_name='Rol Institucional'
    )
    telefono = models.CharField(max_length=20, blank=True, null=True, verbose_name='Número de Teléfono')
    departamento = models.CharField(max_length=150, blank=True, null=True, verbose_name='Departamento / Facultad')

    # Usar el email como identificador opcional si se requiere
    REQUIRED_FIELDS = ['email', 'role']

    class Meta:
        verbose_name = 'Usuario Institucional'
        verbose_name_plural = 'Usuarios Institucionales'

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
