from django.urls import path
from .views import SendPasswordResetEmailView, UserChangePasswordView, UserLoginView, UserProfileView, UserRegistrationView, UserPasswordResetView,UserFriendAPIView,AllUser,UpdateUserInfo,UserFriendbothTimeUpdateView,AllUserProfileView,UserNumberUpdateView
urlpatterns = [
    path('api/user/register', UserRegistrationView.as_view(), name='register'),
    path('api/user/login', UserLoginView.as_view(), name='login'),
    path('api/user/profile', UserProfileView.as_view({'get': 'list', 'post': 'create','delete':'delete'}), name='profile'),
    path('api/user/UpdateUserInfo',UpdateUserInfo.as_view()),

    path('api/user/UpdateNumber',UserNumberUpdateView.as_view(),name="UserNumberUpdateView"),

    path('api/user/UserFriend',UserFriendAPIView.as_view(),name="UserFriend"),
    path('api/user/Alluser',AllUser.as_view(),name="AllUser"),

    path('api/user/userfriendbothtime/<str:slug>/<str:currenttime>/', UserFriendbothTimeUpdateView.as_view(), name='user-friend-both-update-time'),

    path('api/user/allProfile',AllUserProfileView.as_view({'get': 'list'}),name='AllProfile'),
    
]



#    path('changepassword/', UserChangePasswordView.as_view(), name='changepassword'),
#     path('send-reset-password-email/', SendPasswordResetEmailView.as_view(), name='send-reset-password-email'),
#     path('reset-password/<uid>/<token>/', UserPasswordResetView.as_view(), name='reset-password'),