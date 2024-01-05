from django.urls import path
from .views import ChannelManageView, ChannelUsersManageView, ChannelUserManageView, ChannelMessageManageView


urlpatterns = [
    path('', ChannelManageView.as_view()),
    path('<int:channel>/users/', ChannelUsersManageView.as_view()),
    path('<int:channel>/messages/', ChannelMessageManageView.as_view()),
    path('<int:channel>/users/<int:user>/', ChannelUserManageView.as_view()),
]