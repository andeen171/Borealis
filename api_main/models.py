from django.db import models
from django.conf import settings
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill

from api_auth.models import Address

image_root = 'static/images/'
User = settings.AUTH_USER_MODEL


class Order(models.Model):
    title = models.CharField(max_length=256)
    description = models.TextField(max_length=256)
    created_at = models.DateTimeField(auto_now_add=True)
    device = models.CharField(max_length=256)
    category = models.CharField(max_length=256)
    closed = models.BooleanField(default=False)
    closed_at = models.DateTimeField(null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Image(models.Model):
    src = models.ImageField(upload_to=f'{image_root}orders/')
    thumbnail = ImageSpecField(source='src', processors=[ResizeToFill(100, 100)],
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
    offer = models.OneToOneField(Offer, on_delete=models.CASCADE)
    value = models.DecimalField(max_digits=6, decimal_places=2)
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='client')
    technician = models.ForeignKey(User, on_delete=models.CASCADE, related_name='technician')
    level = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    closed = models.BooleanField(default=False)
    closed_at = models.DateTimeField(null=True)


class Stage(models.Model):
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE)
    level = models.IntegerField(default=2)
    description = models.CharField(max_length=512)
    started_at = models.DateTimeField(auto_now_add=True)
    ending_prediction = models.DateTimeField(null=True)
    finished = models.BooleanField(default=False)
    finished_at = models.DateTimeField(null=True)


class Payment(models.Model):
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE)
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payer')
    technician = models.ForeignKey(User, on_delete=models.CASCADE, related_name='receiver')
    value = models.DecimalField(max_digits=6, decimal_places=2)
