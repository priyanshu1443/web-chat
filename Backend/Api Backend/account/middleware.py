# yourapp/middleware.py
from django.middleware.common import CommonMiddleware

class DynamicCorsMiddleware(CommonMiddleware):
    def process_response(self, request, response):
        # Get the user's IP address from the request
        user_ip = request.META.get('REMOTE_ADDR')

        # Set CORS headers based on the user's IP address
        response['Access-Control-Allow-Origin'] = f"http://{user_ip}:8000/"
        print(response['Access-Control-Allow-Origin'])

        return super().process_response(request, response)