# Generated by Django 2.1.4 on 2019-01-04 21:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('interop', '0007_auto_20190104_1938'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='clientsession',
            name='port',
        ),
        migrations.AddField(
            model_name='clientsession',
            name='created',
            field=models.DateTimeField(null=True),
        ),
    ]
