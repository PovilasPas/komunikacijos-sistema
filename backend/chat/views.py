from rest_framework import generics
from rest_framework.exceptions import NotFound, PermissionDenied
from .serializers import ChannelSerializer, ChannelUserSerializer, ChannelUserUpdateSerializer, ChannelMessageSerializer
from .permissions import CanInviteNewUserToChannel, CanAccessChannelInfo, CanAccessChannelUserInfo, CanDeleteChannelUserInfo
from .models import Channel, ChannelUser, Message
from core.views import BaseManageView
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class ChannelListView(generics.ListAPIView):
    serializer_class = ChannelSerializer

    def get_queryset(self):
        user = self.request.user
        return Channel.objects.filter(channeluser__user=user)

class ChannelCreateView(generics.CreateAPIView):
    queryset = Channel.objects.all()
    serializer_class = ChannelSerializer

class ChannelManageView(BaseManageView):
    VIEWS_BY_METHOD = {
        'GET': ChannelListView.as_view,
        'POST': ChannelCreateView.as_view
    }


class ChannelUserListView(generics.ListAPIView):
    serializer_class = ChannelUserSerializer
    permission_classes = [CanAccessChannelInfo]

    def get_queryset(self):
        channel_id = self.kwargs['channel']
        channel = Channel.objects.filter(id=channel_id).first()
        if channel is not None:
            return ChannelUser.objects.filter(channel=channel_id).order_by('-role')
        raise NotFound()
    
class ChannelUserCreateView(generics.CreateAPIView):
    serializer_class = ChannelUserSerializer
    permission_classes = [CanAccessChannelInfo, CanInviteNewUserToChannel]

    def get_queryset(self):
        channel_id = self.kwargs['channel']
        channel = Channel.objects.filter(id=channel_id).first()
        if channel is not None:
            return ChannelUser.objects.filter(channel=channel_id)
        raise NotFound()
        
class ChannelUsersManageView(BaseManageView):
    VIEWS_BY_METHOD = {
        'GET': ChannelUserListView.as_view,
        'POST': ChannelUserCreateView.as_view
    }

class ChannelUserShowView(generics.RetrieveAPIView):
    serializer_class = ChannelUserSerializer
    permission_classes = [CanAccessChannelUserInfo]

    def get_object(self):
        channel_id = self.kwargs['channel']
        user_id = self.kwargs['user']
        channel_user = ChannelUser.objects.filter(channel=channel_id).filter(user=user_id).first()
        if channel_user is not None:
            self.check_object_permissions(self.request, channel_user)
            return channel_user
        raise NotFound()

class ChannelUserUpdateView(generics.UpdateAPIView):
    serializer_class = ChannelUserUpdateSerializer
    http_method_names = ['put']
    permission_classes = [CanAccessChannelUserInfo]

    def perform_update(self, serializer):
        instance  = self.get_object()
        if instance.user == self.request.user and instance.role != serializer.validated_data['role']:
            raise PermissionDenied()
        elif instance.user.id != self.request.user.id:
            owner = ChannelUser.objects.filter(channel=instance.channel).filter(user=self.request.user).first()
            if owner is None or owner is not None and (owner.role != 2 or owner.role == 2 and instance.has_accepted != serializer.validated_data['has_accepted']):
                raise PermissionDenied()
        return super().perform_update(serializer)

    def get_object(self):
        channel_id = self.kwargs['channel']
        user_id = self.kwargs['user']
        channel_user = ChannelUser.objects.filter(channel=channel_id).filter(user=user_id).first()
        if channel_user is not None:
            self.check_object_permissions(self.request, channel_user)
            return channel_user
        raise NotFound()
    
class ChannelUserDeleteView(generics.DestroyAPIView):
    permission_classes = [CanDeleteChannelUserInfo]
    
    def get_object(self):
        channel_id = self.kwargs['channel']
        user_id = self.kwargs['user']
        channel_user = ChannelUser.objects.filter(channel=channel_id).filter(user=user_id).first()
        if channel_user is not None:
            self.check_object_permissions(self.request, channel_user)
            return channel_user
        raise NotFound()
    
class ChannelUserManageView(BaseManageView):
    VIEWS_BY_METHOD = {
        'GET': ChannelUserShowView.as_view,
        'PUT': ChannelUserUpdateView.as_view,
        'DELETE': ChannelUserDeleteView.as_view
    }


class ChannelMessageListView(generics.ListAPIView):
    serializer_class = ChannelMessageSerializer
    permission_classes = [CanAccessChannelInfo]

    def get_queryset(self):
        channel_id = self.kwargs['channel']
        channel = Channel.objects.filter(id=channel_id).first()
        if channel is not None:
            return Message.objects.filter(channel_user__channel=channel_id).order_by('created_at')
        raise NotFound()

class ChannelMessageCreateView(generics.CreateAPIView):
    serializer_class = ChannelMessageSerializer
    permission_classes = [CanAccessChannelInfo]

    def get_queryset(self):
        channel_id = self.kwargs['channel']
        channel = Channel.objects.filter(id=channel_id).first()
        if channel is not None:
            return Message.objects.filter(channel_user__channel=channel_id)
        raise NotFound()
    
    def perform_create(self, serializer):
        serializer.save()
        channel_layer = get_channel_layer()
        channel_id = self.kwargs['channel']
        async_to_sync(channel_layer.group_send)(
            f'channel_{channel_id}',
            {
                'type': 'chat_message',
                'message': serializer.data
            }
        )

class ChannelMessageManageView(BaseManageView):
    VIEWS_BY_METHOD = {
        'GET': ChannelMessageListView.as_view,
        'POST': ChannelMessageCreateView.as_view
    }

