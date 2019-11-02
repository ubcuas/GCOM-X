from django.urls import path
from surveyopti import views
from django.conf.urls import re_path

urlpatterns = [
    re_path(r'^api/calc/$', views.calc, name='surveyopti.api.calc'),
]
