from django.contrib.auth.models import User
from .serializers import UserSerializer
from rest_framework import generics, permissions


class UserCreateView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.all()
    serializer_class = UserSerializer


