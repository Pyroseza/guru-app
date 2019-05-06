from django.contrib import admin

from oxd.models import Configuration, LoginState
from oxd.forms import ConfigurationForm


class ConfigurationAdmin(admin.ModelAdmin):
    """
    Set configuration form for oxd Configuration model in admin.
    """

    form = ConfigurationForm


admin.site.register(Configuration, ConfigurationAdmin)
admin.site.register(LoginState)
