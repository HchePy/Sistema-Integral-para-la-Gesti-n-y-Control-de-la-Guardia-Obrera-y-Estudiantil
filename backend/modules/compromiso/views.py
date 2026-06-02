from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "modulo": "Compromiso de Guardia",
            "mensaje": "Conexión exitosa con el Backend de la Guardia UHO.",
            "usuario": request.user.username,
            "rol": request.user.role,
            "estado": "Boilerplate v1.0 Activo"
        })
