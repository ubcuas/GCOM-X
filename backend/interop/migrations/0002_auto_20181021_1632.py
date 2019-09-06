# Generated by Django 2.1.1 on 2018-10-21 23:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('interop', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderedboundarypts',
            name='mission',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='interop.UasMission'),
        ),
        migrations.AlterUniqueTogether(
            name='orderedboundarypts',
            unique_together={('order', 'fly_zone', 'mission')},
        ),
    ]
