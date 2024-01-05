from django.conf import settings
from django.db import models

class Channel(models.Model):
    title = models.CharField(max_length=255)

    class Meta:
        db_table = 'channels'

class ChannelUser(models.Model):
    roles = [
        (0, 'user'), 
        (1, 'user_inviter'), 
        (2, 'owner')
    ]

    has_accepted = models.BooleanField(default=False)
    role = models.IntegerField(choices=roles, default=0)
    channel = models.ForeignKey('Channel', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    class Meta:
        db_table = 'channel_users'
        unique_together = ('channel', 'user')

class Message(models.Model):
    text = models.TextField(blank=True)
    channel_user = models.ForeignKey('ChannelUser', on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'messages'
