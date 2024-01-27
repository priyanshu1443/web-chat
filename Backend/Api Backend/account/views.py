
import base64
from django.core.files.base import ContentFile
from .models import User,Message,profileUser,UserFriendboth,Group,GroupUsers
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from account.serializers import SendPasswordResetEmailSerializer, UserChangePasswordSerializer, UserLoginSerializer, UserPasswordResetSerializer, UserProfileSerializer, UserRegistrationSerializer, Users,Usersfriend,UserNameUpdateSerializer,UserFriendbothSerializer,UserNumberUpdateSerializer
from django.contrib.auth import authenticate
from account.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated

from rest_framework import viewsets

# Generate Token Manually

 
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class UserRegistrationView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = get_tokens_for_user(user)
        return Response({'token': token, 'msg': 'Registration Successful'}, status=status.HTTP_201_CREATED)


class UserLoginView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        print("Run")
        print(request.data)
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.data.get('email')
        password = serializer.data.get('password')
        user = authenticate(email=email, password=password)
        if user is not None:
            token = get_tokens_for_user(user)
            
            instance = get_object_or_404(User, email=email)
            
            serializer = Users(instance)
            
            return Response({'token': token, 'msg': 'Login Success','data':serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({'errors': {'non_field_errors': ['Email or Password is not Valid']}}, status=status.HTTP_404_NOT_FOUND)





    
class UserProfileView(viewsets.ModelViewSet):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    queryset = profileUser.objects.all()
    serializer_class = UserProfileSerializer

    # Define the actions your view should support
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(user=request.user)

        if not queryset.exists():
            return Response({'message': 'No data available'}, status=204)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    

    def create(self, request, *args, **kwargs):
        user_id = request.data.get('user')
        profile_image = request.data.get('profile_image')

        file_name = request.data.get('filename')
        print(file_name)
        user_profile_data = {'user': user_id, 'profile_img': profile_image}
        serializer = self.get_serializer(data=user_profile_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def delete(self, request, *args, **kwargs):
        user_id = request.data.get('user')
        print(user_id)
        user_profile = profileUser.objects.get(user=user_id)
        serializer = self.get_serializer(user_profile)
        user_profile.delete()
        return Response({'message': 'User profile deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
       

class AllUser(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        print(request.user)
        users = User.objects.all()
        serialize = Users(users, many=True)
        return Response({"data": serialize.data}, status=status.HTTP_200_OK)




class UserChangePasswordView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = UserChangePasswordSerializer(data=request.data, context={'user': request.user})
        serializer.is_valid(raise_exception=True)
        return Response({'msg': 'Password Changed Successfully'}, status=status.HTTP_200_OK)


class SendPasswordResetEmailView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        serializer = SendPasswordResetEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'msg': 'Password Reset link send. Please check your Email'}, status=status.HTTP_200_OK)


class UserPasswordResetView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, uid, token, format=None):
        serializer = UserPasswordResetSerializer(
            data=request.data, context={'uid': uid, 'token': token})
        serializer.is_valid(raise_exception=True)
        return Response({'msg': 'Password Reset Successfully'}, status=status.HTTP_200_OK)

class UserFriendAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self,request):
        frnds = UserFriendboth.objects.filter(user=request.user)
        serializer = Usersfriend(frnds,many=True)
        
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)
    

    def post(self, request):
        print(request.data)
        
        
        serializer = Usersfriend(data=request.data)
        
        if serializer.is_valid():
            print(serializer.data)
            user = serializer.validated_data.get('user')
            frnd = serializer.validated_data.get('friend')
            key = serializer.validated_data.get('key')
            time = serializer.validated_data.get('time')
            self.save_friends(user,frnd,key,time)
            self.save_friends(frnd,user,key,time)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def save_friends(self, user, frnd, key, time):
            instance =UserFriendboth(user=user, friend=frnd,key=key,time = time)
            instance.save()
    
    
# class Messages(APIView):
#     renderer_classes = [UserRenderer]
#     permission_classes = [IsAuthenticated]
#     def get(self,request,friend):
#         print(friend)
#         message = Message.objects.filter(sender=request.user,recipient = friend)
#         serializer = UserMessages(message,many=True)
#         return Response({"data":serializer.data}, status=status.HTTP_200_OK)

#     def post(self,request):
#         serializer = UserMessages(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save() 
#         return Response({"data":serializer.data}, status=status.HTTP_200_OK)


class UpdateUserInfo(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        user = request.user
        print()
        serializer = UserNameUpdateSerializer(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
class UserNumberUpdateView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        user = request.user
        serializer = UserNumberUpdateSerializer(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        print(request.data)
        serializer.save()
        print("Number Update")
        return Response(serializer.data)

    
class CreateGroupAPI(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self,request, *args, **kwargs):
        user = request.user
        serializer = UserNameUpdateSerializer(data=request.data)
        if serializer.is_valid():
            group_name = serializer.validated_data.get('group_name')
            group_creator = user
            group_key = serializer.validated_data.get('group_key')
            group = Group(group_name=group_name,group_creator=group_creator,group_key=group_key)
            group.save()

class AddGroupUser(APIView):
    pass



# delete chat
# delete account
# 

class UserFriendbothTimeUpdateView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def put(self, request, slug,currenttime):
        try:
            instance = UserFriendboth.objects.get(slug=slug)
        except UserFriendboth.DoesNotExist:
            return Response({"error": "Object not found"}, status=status.HTTP_404_NOT_FOUND)

        # Extract only the 'time' field data from the request
        
        if currenttime is not None:
            # print(f' ye hai time data {currenttime}')
            instance.time = currenttime
            instance.save()
            frnds = UserFriendboth.objects.filter(user=request.user)
            serializer = Usersfriend(frnds,many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "'time' field is required"}, status=status.HTTP_400_BAD_REQUEST)


class AllUserProfileView(viewsets.ModelViewSet):
    print("yeeeeeeeeeeeeeeeeeeeeeee")
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    queryset = profileUser.objects.all()
    serializer_class = UserProfileSerializer





