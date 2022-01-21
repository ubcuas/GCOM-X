# Generated by Django 3.1.5 on 2021-01-23 22:38

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ImpImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(default='', unique=True)),
                ('processed_flag', models.IntegerField(default=0)),
                ('latitude', models.DecimalField(decimal_places=8, default=0, max_digits=11)),
                ('longitude', models.DecimalField(decimal_places=8, default=0, max_digits=11)),
                ('altitude', models.DecimalField(decimal_places=4, default=0, max_digits=7)),
                ('heading', models.IntegerField(default=0)),
                ('roll', models.FloatField(default=0)),
                ('yaw', models.FloatField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='ImpODLC',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('auvsi_id', models.IntegerField(null=True)),
                ('name', models.TextField(default='')),
                ('description', models.TextField(blank=True, default='')),
                ('latitude', models.DecimalField(decimal_places=8, default=0, max_digits=11)),
                ('longitude', models.DecimalField(decimal_places=8, default=0, max_digits=11)),
                ('latitudes', django.contrib.postgres.fields.ArrayField(base_field=models.DecimalField(decimal_places=8, default=0, max_digits=11), default=list, size=None)),
                ('longitudes', django.contrib.postgres.fields.ArrayField(base_field=models.DecimalField(decimal_places=8, default=0, max_digits=11), default=list, size=None)),
                ('type', models.TextField(blank=True, default='')),
                ('shape', models.TextField(blank=True, default='')),
                ('background_color', models.TextField(blank=True, default='')),
                ('alphanumeric', models.TextField(blank=True, default='')),
                ('alphanumeric_color', models.TextField(blank=True, default='')),
                ('orientation', models.TextField(blank=True, default='')),
                ('orientationAbss', django.contrib.postgres.fields.ArrayField(base_field=models.DecimalField(decimal_places=4, default=0, max_digits=7), default=list, size=None)),
                ('image_source', models.TextField(default='')),
                ('x', models.DecimalField(decimal_places=5, default=0, max_digits=6)),
                ('y', models.DecimalField(decimal_places=5, default=0, max_digits=6)),
                ('w', models.DecimalField(decimal_places=5, default=0, max_digits=6)),
                ('h', models.DecimalField(decimal_places=5, default=0, max_digits=6)),
                ('image_source_model', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='imp_module.impimage')),
            ],
        ),
    ]
