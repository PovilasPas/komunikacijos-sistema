from rest_framework.exceptions import APIException
from rest_framework import status

class ConflictException(APIException):
    status_code  = status.HTTP_409_CONFLICT
    default_detail = "The action is unavailable due to a conflict"

