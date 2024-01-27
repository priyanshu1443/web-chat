import json
from channels.generic.websocket import AsyncWebsocketConsumer

from asgiref.sync import sync_to_async
from django.contrib.auth.models import User
from channels.db import database_sync_to_async

from .models import UserFriendSocket, WebSocketUserfriendsMessage
from django.core.serializers.json import DjangoJSONEncoder
from .serializers import UserfriendMessageSocketSerializer


class ChatConsumer(AsyncWebsocketConsumer):
    @database_sync_to_async
    def save_UserFriend(self, data):
        userfriend = data['targetRoomId']
        UserFriend, created = UserFriendSocket.objects.get_or_create(userfriend=userfriend)
        if UserFriend:
            print(f'already {userfriend}')
        else:
            print("created")
        return True

    @database_sync_to_async
    def get_message(self, data):
        userfriend = data['targetRoomId']
        user_friend = UserFriendSocket.objects.get(userfriend=userfriend)
        if user_friend:
            messages = WebSocketUserfriendsMessage.objects.filter(userfriend=user_friend)
            return list(messages.values())
        return []

    @database_sync_to_async
    def save_data_to_model(self, data):
        userfriend = data['targetRoomId']
        UserFriend = UserFriendSocket.objects.get(userfriend=userfriend)
        if UserFriend:
            data = WebSocketUserfriendsMessage(
                userfriend=UserFriend, content=data['content'], sender=data['sender'], time=data['time'])
            data.save()
            print("Data Saved")

        serializer = UserfriendMessageSocketSerializer(data=data)
        if serializer.is_valid():
            instance = serializer.save()
            print("Data Saved")
            return instance
        return True

    @database_sync_to_async
    def delete_message(self, data):
        userfriend = data['targetRoomId']
        user_friend = UserFriendSocket.objects.get(userfriend=userfriend)
        if user_friend:
            print(data['sender'])
            messages = WebSocketUserfriendsMessage.objects.get(userfriend=user_friend, id=data['id'], sender=data['sender'])
            if messages:
                messages.delete()
                print("message deleted")
            else:
                print("not available")

    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["key"]
        self.room_group_name = f"chat_{self.room_name}"
        print(self.room_group_name)
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        print("disconnected")

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        
        if text_data_json['method'] == 'get':
            await self.save_UserFriend(text_data_json)
            print("getting data")
            message = await self.get_message(text_data_json)
            if message:
                serialized_data = UserfriendMessageSocketSerializer(
                    message, many=True).data
                # print(serialized_data)
                await self.send(text_data=json.dumps({"status": "Data Received", "message": serialized_data}))
            else:
                await self.send(text_data=json.dumps({"status": "No Data available"}))

        elif text_data_json['method'] == 'delete':
            print("deletingggggggggggg")
            print(text_data_json)
            await self.delete_message(text_data_json)
            # After Delete message
            message = await self.get_message(text_data_json)
            if message:
                serialized_data = UserfriendMessageSocketSerializer(
                    message, many=True).data
                print(serialized_data)
                await self.send(text_data=json.dumps({"status": "After deleted message", "message": serialized_data}))

        else:
            # sending message to the websocket connection
            await self.channel_layer.group_send(
                self.room_group_name, {
                    "type": "chat.message", "message": text_data_json["content"], 'sender': text_data_json["sender"], 'time': text_data_json["time"]}
            )

            await self.save_data_to_model(text_data_json)

        

    async def chat_message(self, event):
        print(f'OKKKKKKKKKKKKKKKKKKKKKKK {event}')
        message = event["message"]
        sender = event['sender']
        time = event['time']
        # Send message return to WebSocket
        await self.send(text_data=json.dumps({"content": message, 'sender': sender, 'time': time}))
