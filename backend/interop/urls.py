from django.urls import path
from interop import views
from django.urls import re_path

urlpatterns = [
    re_path(r'api/interop/login$', views.login, name='interop.login'),
    re_path(r'api/interop/mission$', views.mission, name='interop.mission'),
    re_path(r'api/interop/missions/(?P<mission_id>[0-9])/?$', views.missions, name='interop.missions'),
    re_path(r'api/interop/status/?$', views.status, name='interop.status'),
    re_path(r'api/interop/teams/?$', views.teams, name='interop.teams'),
    re_path(r'api/interop/telemetry/?$', views.telemetry, name='interop.telemetry'),
    re_path(r'api/interop/teamtelemetry/?$', views.teams, name='interop.teamtelemetry'),
    re_path(r'api/interop/telemstatus/?$', views.telem_status, name='interop.telem_status'),
    re_path(r'api/interop/teamtelemstatus/?$', views.team_telem_status, name='interop.team_telem_status')
]
