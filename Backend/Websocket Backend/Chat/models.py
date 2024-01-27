from django.db import models
from django.contrib.auth.models import BaseUserManager,AbstractBaseUser
from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from django.dispatch import receiver
import os
from django.core.validators import FileExtensionValidator
from django.db.models.signals import post_delete

  
class UserFriendSocket(models.Model):
    userfriend = models.CharField(max_length=255,unique =True,primary_key=True)

    def __str__(self):
        return f"{self.userfriend}"


class WebSocketUserfriendsMessage(models.Model):
    userfriend= models.ForeignKey(UserFriendSocket,on_delete=models.CASCADE)
    sender = models.IntegerField()
    content = models.TextField(blank=True)
    is_read = models.BooleanField(default=False)
    time = models.CharField(max_length=300)
    image = models.ImageField(upload_to="MessageMedia/Photos", blank=True, null=True)
    video = models.FileField(upload_to='MessageVideo/Videos',null=True,blank=True,validators=[FileExtensionValidator(allowed_extensions=['MOV','avi','mp4','webm','mkv'])])
    delete_access = models.CharField(max_length=10,blank=True,null=True,default='')
    
 
    def __str__(self):
        return f"{self.userfriend}"
    
    def mark_as_read(self):
        self.is_read = True
        self.save()

@receiver(models.signals.post_delete, sender=WebSocketUserfriendsMessage)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    
    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)

    if instance.video:
        if os.path.isfile(instance.video.path):
            os.remove(instance.video.path)


class SocketGroup(models.Model):
    group = models.CharField(max_length=300,unique=True)
    def __str__(self):
        return f"{self.group}"




class SocketGroupMessage(models.Model):
    group = models.ForeignKey(SocketGroup,on_delete=models.CASCADE)
    sender = models.IntegerField()
    content = models.TextField(blank=True)
    is_read = models.BooleanField(default=False)
    time = models.CharField(max_length=300)
    image = models.ImageField(upload_to="GroupPhotos/Photos", blank=True, null=True)
    video = models.FileField(upload_to='GroupVideo/Videos',null=True,blank=True,validators=[FileExtensionValidator(allowed_extensions=['MOV','avi','mp4','webm','mkv'])])
