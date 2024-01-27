from django.urls import path
from django.urls import re_path
from . import views


urlpatterns = [
    
]

from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from Chat import consumers


application = ProtocolTypeRouter({
    "websocket": URLRouter(
        [
            # path('ws/chat/', consumers.ChatConsumer.as_asgi()),
            re_path(r"ws/chat/(?P<key>\w+)/$", consumers.ChatConsumer.as_asgi()),
            # Add more paths and consumers as needed.
   ]
),
})