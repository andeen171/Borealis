# Generated by Django 3.2.8 on 2021-10-26 23:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api_main', '0003_auto_20211026_1610'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='thumbnail',
        ),
    ]
