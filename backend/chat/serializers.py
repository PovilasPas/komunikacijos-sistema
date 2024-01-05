from rest_framework import serializers
from users.serializers import UserSerializer
from .models import Channel, ChannelUser, Message
from django.contrib.auth.models import User
from django.db import IntegrityError
from core import exceptions

class ChannelSerializer(serializers.ModelSerializer):
    title = serializers.CharField(min_length=5, max_length=255)

    class Meta:
        model = Channel
        fields = ['id', 'title']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        user = self.context['request'].user
        channel_user = ChannelUser.objects.filter(user=user).filter(channel=instance).first()
        representation['invite_pending'] = not channel_user.has_accepted
        return representation

    def create(self, validated_data):
        channel = Channel.objects.create(**validated_data)
        user = self.context['request'].user
        ChannelUser.objects.create(has_accepted=True, role=2, channel=channel, user=user)
        return channel
    
class ChannelUserSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=ChannelUser.roles, read_only=True)
    user = UserSerializer(read_only=True)
    username = serializers.SlugRelatedField(
        slug_field='username', 
        queryset=User.objects.all(), 
        write_only=True, error_messages={
            'does_not_exist': 'User with this username ({value}) does not exist',
            'null': 'This field may not be blank.'
            }
    )

    class Meta:
        model = ChannelUser
        fields = ['has_accepted', 'role', 'channel', 'user', 'username']
        read_only_fields = ['has_accepted', 'channel']
        
    def create(self, validated_data):
        user = validated_data['username']
        try:
            channel_id = self.context['view'].kwargs['channel']
            channel_user = ChannelUser.objects.create(has_accepted=False, role=0, channel_id=channel_id, user_id=user.id)
            return channel_user
        except IntegrityError:
            raise exceptions.ConflictException(f'{user} has already been invited to the channel')
        
class ChannelUserUpdateSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=ChannelUser.roles, error_messages={
        'invalid_choice': '{input} is not a valid choice.'
        })
    has_accepted = serializers.BooleanField()

    class Meta:
        model = ChannelUser
        fields = ['has_accepted', 'role']

    def to_representation(self, instance):
        serializer = ChannelUserSerializer(instance)
        return serializer.data

    def validate_role(self, role):
        if role == self.instance.role:
            return role
        elif role == 2:
            raise serializers.ValidationError('There can only be one owner per channel.')
        return role
    
class ChannelMessageSerializer(serializers.ModelSerializer):
    text = serializers.CharField(allow_blank=True, max_length=65536)

    class Meta:
        model = Message
        fields = ['id', 'text', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def create(self, validated_data):
        channel_id = self.context['view'].kwargs['channel']
        user = self.context['request'].user
        channel_user = ChannelUser.objects.filter(channel=channel_id).filter(user=user).first()
        return Message.objects.create(text=validated_data['text'], channel_user=channel_user)
    
    # def get_created_at_formatted(self, obj:Message):
    #     return obj.created_at.strftime("%d-%m-%Y %H:%M:%S")

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['user'] = UserSerializer(instance.channel_user.user).data
        return representation