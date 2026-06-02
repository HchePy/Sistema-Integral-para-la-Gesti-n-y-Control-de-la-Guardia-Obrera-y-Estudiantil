from django.urls import re_path

# Mapeo de rutas WebSocket a consumidores de Channels
websocket_urlpatterns = [
    # Las futuras rutas de notificaciones en tiempo real o chat se registrarán aquí
    # re_path(r'ws/notifications/$', consumers.NotificationConsumer.as_asgi()),
]
