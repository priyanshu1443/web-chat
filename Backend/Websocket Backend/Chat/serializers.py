from rest_framework import serializers
from .models import WebSocketUserfriendsMessage
class UserfriendMessageSocketSerializer(serializers.ModelSerializer):
    userfriend = serializers.CharField(source='userfriend_id')
    class Meta:
        model = WebSocketUserfriendsMessage
        fields = '__all__'