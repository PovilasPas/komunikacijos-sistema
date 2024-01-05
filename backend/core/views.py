from django.http import HttpResponseNotAllowed
from rest_framework.views import APIView
from rest_framework.exceptions import MethodNotAllowed

class BaseManageView(APIView):

    def dispatch(self, request, *args, **kwargs):
        if not hasattr(self, 'VIEWS_BY_METHOD'):
            raise Exception('VIEWS_BY_METHOD static dictionary must be definde on a ManageView class!')
        if request.method in self.VIEWS_BY_METHOD:
            return self.VIEWS_BY_METHOD[request.method]()(request, *args, **kwargs)
        
        return super().dispatch(request, *args, **kwargs)
        


