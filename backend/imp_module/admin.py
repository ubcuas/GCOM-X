from django.contrib import admin

from imp_module.models import *

# Register your models here.
class ImpImage_admin(admin.ModelAdmin):
    list_display = ('name', 'processed_flag')
admin.site.register(ImpImage, ImpImage_admin)

class ImpODLC_admin(admin.ModelAdmin):
    list_display = ('name', 'auvsi_id', 'image_source', 'image_source_model')
admin.site.register(ImpODLC, ImpODLC_admin)
