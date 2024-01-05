from rest_framework import permissions
from .models import ChannelUser
from rest_framework.exceptions import NotFound

class CanInviteNewUserToChannel(permissions.BasePermission):
    def has_permission(self, request, view):
        channel_id = view.kwargs['channel']
        channel_user = ChannelUser.objects.filter(channel=channel_id).filter(user=request.user).first()
        if channel_user.role == 0:
            return False
        return True
    
class CanAccessChannelInfo(permissions.BasePermission):
    def has_permission(self, request, view):
        channel_id = view.kwargs['channel']
        channel_user = ChannelUser.objects.filter(channel=channel_id).filter(user=request.user).first()
        if channel_user is None or channel_user is not None and not channel_user.has_accepted:
            raise NotFound()
        return True
    
class CanAccessChannelUserInfo(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        channel_id = view.kwargs['channel']
        channel_user = ChannelUser.objects.filter(channel=channel_id).filter(user=request.user).first()
        if request.user.id == obj.user_id:
            return True
        if channel_user is not None and channel_user.has_accepted:
            return True
        raise NotFound()
    
class CanDeleteChannelUserInfo(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.id == obj.user_id:
            return True
        raise NotFound()