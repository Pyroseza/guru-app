# Generated by Django 2.2.2 on 2019-06-10 17:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0003_user_job_title'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='phone_number',
            field=models.CharField(blank=True, max_length=100, verbose_name='phone number'),
        ),
    ]
