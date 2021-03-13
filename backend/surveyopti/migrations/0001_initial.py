# Generated by Django 3.1.5 on 2021-03-13 20:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('imp_module', '0001_initial'),
        ('interop', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='SurveyPOI',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('latitude', models.FloatField()),
                ('longitude', models.FloatField()),
                ('order', models.IntegerField(null=True)),
                ('image', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='imp_module.impimage')),
                ('mission', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='interop.uasmission')),
            ],
        ),
    ]
