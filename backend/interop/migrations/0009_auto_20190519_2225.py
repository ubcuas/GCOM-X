# Generated by Django 2.2 on 2019-05-20 05:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('interop', '0008_auto_20190104_2140'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='orderedsearchgridpoint',
            name='altitude_msl',
        ),
        migrations.RemoveField(
            model_name='uasmission',
            name='home_pos',
        ),
    ]
