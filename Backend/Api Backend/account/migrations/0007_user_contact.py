# Generated by Django 4.2.7 on 2023-12-17 18:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0006_group_userfriendboth_time_groupusers'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='contact',
            field=models.CharField(blank=True, default='', max_length=15, null=True),
        ),
    ]
