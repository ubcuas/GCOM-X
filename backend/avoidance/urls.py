from django.urls import path
from avoidance import views
from django.urls import re_path

urlpatterns = [
    re_path(r'^api/winchstatus/?$', views.winch_status, name='avoidance.api.winch_status'),
    re_path(r'^api/route/(?P<mission_id>[0-9]+)/?$', views.route, name='avoidance.api.route'),
    re_path(r'^api/current_route/?$', views.current_route, name='avoidance.api.current_route'),
    re_path(r'^api/reroute/(?P<mission_id>[0-9]+)/?$', views.reroute, name='avoidance.api.reroute'),
    re_path(r'^api/missions/?$', views.missions, name='avoidance.api.missions'),
    re_path(r'^file/route/(?P<mission_id>[0-9]+)/?$', views.route_file, name='avoidance.file.route'),
    re_path(r'^file/obs/(?P<mission_id>[0-9]+)/?$', views.obs_file, name='avoidance.file.obs'),
    re_path(r'^api/upload_to_acom/(?P<mission_id>[0-9]+)/?$', views.upload_to_acom, name='avoidance.api.upload_to_acom'),
    re_path(r'^api/acom_heartbeat/?$', views.acom_heartbeat, name='avoidance.api.acom_heartbeat'),
    re_path(r'^api/acom_arm/?$', views.acom_arm, name='avoidance.api.acom_arm'),
    re_path(r'^api/acom_disarm/?$', views.acom_disarm, name='avoidance.api.acom_disarm'),
    re_path(r'^api/acom_setmode_manual/?$', views.acom_setmode_manual, name='avoidance.api.acom_setmode_manual'),
    re_path(r'^api/acom_setmode_auto/?$', views.acom_setmode_auto, name='avoidance.api.acom_setmode_auto'),
    re_path(r'^api/acom_setmode_guided/?$', views.acom_setmode_guided, name='avoidance.api.acom_setmode_guided'),
    re_path(r'^api/acom_setmode_rtl/?$', views.acom_setmode_rtl, name='avoidance.api.acom_setmode_rtl')
]
