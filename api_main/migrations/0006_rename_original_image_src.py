# Generated by Django 3.2.8 on 2021-10-30 01:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api_main', '0005_auto_20211029_1326'),
    ]

    operations = [
        migrations.RenameField(
            model_name='image',
            old_name='original',
            new_name='src',
        ),
    ]
