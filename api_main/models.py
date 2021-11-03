from django.db import models
from django.contrib.auth.models import User
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill

image_root = 'static/images/'


class Category(models.Model):
    name = models.CharField(max_length=256)
    orders_active = models.IntegerField(default=0)


class Order(models.Model):
    title = models.CharField(max_length=256)
    description = models.TextField(max_length=256)
    created_at = models.DateTimeField(auto_now_add=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    closed = models.BooleanField(default=False)
    closed_at = models.DateTimeField(null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Image(models.Model):
    src = models.ImageField(upload_to=f'{image_root}orders/')
    thumbnail = ImageSpecField(source='original', processors=[ResizeToFill(100, 100)],
                               format='JPEG', options={'quality': 60})
    order = models.ForeignKey(Order, on_delete=models.CASCADE)


class Offer(models.Model):
    problem = models.CharField(max_length=256)
    description = models.TextField(max_length=512)
    value_estimate = models.DecimalField(max_digits=6, decimal_places=2)
    need_replacement = models.BooleanField(default=False)
    replacements = models.TextField(max_length=256, null=True)
    accepted = models.BooleanField(default=False)
    accepted_at = models.DateTimeField(null=True)
    sent_at = models.DateTimeField(auto_now_add=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Contract(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    offer = models.ForeignKey(Offer, on_delete=models.CASCADE)
    value = models.DecimalField(max_digits=6, decimal_places=2)
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='client')
    technician = models.ForeignKey(User, on_delete=models.CASCADE, related_name='technician')
    stage = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    closed_at = models.DateTimeField(null=True)
