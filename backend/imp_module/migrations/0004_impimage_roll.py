# Generated by Django 2.1.7 on 2019-04-14 22:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('imp_module', '0003_auto_20190414_1424'),
    ]

    operations = [
        migrations.AddField(
            model_name='impimage',
            name='roll',
            field=models.FloatField(default=0),
        ),
    ]
