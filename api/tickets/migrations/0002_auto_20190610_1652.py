# Generated by Django 2.2.2 on 2019-06-10 16:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tickets', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Attachments',
            new_name='Attachment',
        ),
    ]
