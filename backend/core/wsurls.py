
from django.urls import path
from chat import consumers

ws_urlpatterns = [
    path('channels/<int:channel>/messages/', consumers.ChatRoomConsumer.as_asgi())
]