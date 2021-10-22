from django.db import models
from django.contrib.auth.models import User
from imagekit.models import ProcessedImageField
from django.db.models.signals import post_save
from django.dispatch import receiver
from imagekit.processors import ResizeToFill


class Role(models.Model):
    name = models.CharField(max_length=128)
    users = models.IntegerField(default=0)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    description = models.TextField(null=True)
    role = models.ForeignKey(Role, on_delete=models.DO_NOTHING, null=True)
    pfp = ProcessedImageField(upload_to='static/images/pfps/',
                              processors=[ResizeToFill(100, 100)],
                              format='JPEG',
                              options={'quality': 60},
                              default='static/images/pfps/default.jpg')

    @receiver(post_save, sender=User)
    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            Profile.objects.create(user=instance)

    @receiver(post_save, sender=User)
    def save_user_profile(sender, instance, **kwargs):
        instance.profile.save()
