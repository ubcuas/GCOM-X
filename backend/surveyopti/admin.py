from django.contrib import admin

from surveyopti.models import *

class SurveyPOI_admin(admin.ModelAdmin):
    list_display = ('latitude', 'longitude', 'mission', 'image', 'order')
admin.site.register(SurveyPOI, SurveyPOI_admin)