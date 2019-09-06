from django.urls import path
from interop import views
from django.conf.urls import url

urlpatterns = [
    url(r'api/interop/home$', views.home, name='interop.home'),
    url(r'api/interop/telemetrythread$', views.telemetrythread_control, name='interop.telemetrythread'),
    url(r'api/interop/telemetry$', views.telemetry, name='interop.telemetry')
]
