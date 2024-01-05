from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.db import IntegrityError

class UserSerializer(serializers.ModelSerializer):
    username = serializers.RegexField(r'^[\w.@+-]+$', min_length=5, max_length=150, error_messages={
        'invalid':'Enter a valid username. This field may only contain letters, numbers and @/./+/-/_ characters.'
        })
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirmation = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'password_confirmation']


    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirmation']:
            raise serializers.ValidationError({'password': 'Password confirmation does not match'})
        return super().validate(attrs)
    
    def create(self, validated_data):
        try:
            user = User.objects.create_user(
                username=validated_data['username'],
                password=validated_data['password']
            )
            return user
        except IntegrityError:
            raise serializers.ValidationError({'username': ['This username has already been taken']})