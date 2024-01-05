from rest_framework import exceptions
from rest_framework.views import Response, exception_handler
from rest_framework import status

def api_exception_handler(exception, context):
    response = exception_handler(exception, context)
    if isinstance(exception, exceptions.ValidationError):
        error_dict = {}
        for key, details in response.data.items():
            errors = []
            for message in details:
                errors.append(message)
            error_dict[key] = errors
        error_payload = {"details": error_dict}
        return Response(error_payload, status.HTTP_422_UNPROCESSABLE_ENTITY)
    elif isinstance(exception, exceptions.MethodNotAllowed):
        return Response({"detail": "Method not allowed."}, status.HTTP_405_METHOD_NOT_ALLOWED)
    else:
        return response