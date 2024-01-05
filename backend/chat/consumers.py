import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChannelUser

@database_sync_to_async
def channel_user_exists(channel_id, user_id):
    return ChannelUser.objects.filter(user_id=user_id).filter(channel_id=channel_id).exists()


class ChatRoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope['user']
        if user.is_anonymous:
            await self.close()
            return
        
        self.room_id = self.scope['url_route']['kwargs']['channel']
        cue = await channel_user_exists(self.room_id, user.id)
        if not cue:
            await self.close()
            return

        self.room_group_name = f'channel_{self.room_id}'
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def chat_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps(message))