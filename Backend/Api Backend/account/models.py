from django.db import models
from django.contrib.auth.models import BaseUserManager,AbstractBaseUser
from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from django.dispatch import receiver
import os
from django.core.validators import FileExtensionValidator
from django.db.models.signals import post_delete
from django.dispatch import receiver
#  Custom User Manager
class UserManager(BaseUserManager):
  def create_user(self, email, name, tc, password=None, password2=None):
     
      if not email:
          raise ValueError('User must have an email address')

      user = self.model(
          email=self.normalize_email(email),
          name=name,
          tc=tc,
      )

      user.set_password(password)
      user.save(using=self._db)
      return user

  def create_superuser(self, email, name, tc, password=None):
      user = self.create_user(
          email,
          password=password,
          name=name,
          tc=tc,
      )
      user.is_admin = True
      user.save(using=self._db)
      return user

#  Custom User Model
class User(AbstractBaseUser):
  email = models.EmailField(
      verbose_name='Email',
      max_length=255,
      unique=True,
  )
  name = models.CharField(max_length=200)
  tc = models.BooleanField()
  contact = models.CharField(max_length=15,null=True,blank=True,default='')
  is_active = models.BooleanField(default=True)
  is_admin = models.BooleanField(default=False)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  objects = UserManager()

  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = ['name', 'tc']

  def __str__(self):
      return self.email

  def has_perm(self, perm, obj=None):
      "Does the user have a specific permission?"
      # Simplest possible answer: Yes, always
      return self.is_admin

  def has_module_perms(self, app_label):
      "Does the user have permissions to view the app `app_label`?"
      # Simplest possible answer: Yes, always
      return True

  @property
  def is_staff(self):
      "Is the user a member of staff?"
      # Simplest possible answer: All admins are staff
      return self.is_admin
  

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_image = models.ImageField(upload_to="media/Profiles", blank=True, null=True)

    def __str__(self):
        return self.user.email
    
@receiver(models.signals.post_delete, sender=UserProfile)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """
    Deletes file from filesystem
    when corresponding `MediaFile` object is deleted.
    """
    if instance.profile_image:
        if os.path.isfile(instance.profile_image.path):
            os.remove(instance.profile_image.path)

# class UserFriend(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='users')
#     friend = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_friends')
#     date_added = models.DateTimeField(auto_now_add=True)
#     slug = models.SlugField(unique =True , null = True ,blank = True)

#     class Meta: 
#         unique_together = ('user', 'friend')

#     def save(self,*args,**kwargs):
#         self.slug = slugify(f"{self.user}{self.friend}")
#         return super(UserFriend ,self).save(*args , **kwargs)
#     def __str__(self):
#         return f"{self.user}-{self.friend}"
    
class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    image = models.ImageField(upload_to="media/MessageMedia/Photos", blank=True, null=True)
    video = models.FileField(upload_to='media/MessageVideo/Videos',null=True,blank=True,validators=[FileExtensionValidator(allowed_extensions=['MOV','avi','mp4','webm','mkv'])])
    slug = models.SlugField(unique =True , null = True ,blank = True)
    
    class Meta:
        ordering = ('timestamp',)

    def __str__(self):
        return f"{self.sender}--{self.recipient}"
    
    def mark_as_read(self):
        self.is_read = True
        self.save()

class profileUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_img = models.FileField(upload_to="Profiles", blank=True, null=True)

    def __str__(self):
        return self.user.email
    
@receiver(models.signals.post_delete, sender=profileUser)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """
    Deletes file from filesystem
    when corresponding `MediaFile` object is deleted.
    """
    if instance.profile_img:
        if os.path.isfile(instance.profile_img.path):
            os.remove(instance.profile_img.path)
    
class UserFriendboth(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='users')
    friend = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_friends')
    date_added = models.DateTimeField(auto_now_add=True)
    slug = models.SlugField(unique =True , null = True ,blank = True)
    key = models.CharField(max_length=200)
    time = models.CharField(max_length=50,null=True,blank=True,default = '')

    class Meta: 
        unique_together = ('user', 'friend')

    def save(self,*args,**kwargs):
        self.slug = slugify(f"{self.user}{self.friend}")
        return super(UserFriendboth ,self).save(*args , **kwargs)
    def __str__(self):
        return f"{self.user}-{self.friend}"
    

class Group(models.Model):
    group_name = models.CharField(max_length=200,unique=True)
    group_creator = models.ForeignKey(User,on_delete=models.CASCADE)
    group_key = models.CharField(max_length=255,unique=True)

    def __str__(self):
        return f"{self.group_name}"
    

class GroupUsers(models.Model):
    group = models.ForeignKey(Group,on_delete=models.CASCADE)
    group_user = models.ForeignKey(User,on_delete=models.CASCADE)



