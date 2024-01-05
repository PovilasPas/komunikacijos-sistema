from channels.exceptions import AcceptConnection, DenyConnection, StopConsumer
from django.http import HttpResponseNotFound
from rest_framework.exceptions import NotFound
from django.http import JsonResponse
from urllib.parse import parse_qs
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken, TokenError
from channels.db import database_sync_to_async, close_old_connections
from django.contrib.auth import get_user_model
from channels.auth import AuthMiddlewareStack

class Html404ToJson404Middleware(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if response.status_code == 404 and isinstance(response, HttpResponseNotFound):
            return JsonResponse({"detail":"Not found."}, status=404)
        return response
    

@database_sync_to_async
def get_user(user_id):
    close_old_connections()
    User = get_user_model()
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()
    
class JWTAuthMiddleware:

    def __init__(self, app):
        self.app = app
    
    async def __call__(self, scope, receive, send):
        parsed_query_string = parse_qs(scope['query_string'])
        token = parsed_query_string.get(b'token')
        if token is not None:
            token = token[0].decode('utf-8')
            try:
                access_token = AccessToken(token)
                scope['user'] = await get_user(access_token['user_id'])
            except TokenError:
                scope['user'] = AnonymousUser()
        else:
            scope['user'] = AnonymousUser()
        
        return await self.app(scope, receive, send)

    
            

