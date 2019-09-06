from django.urls import path
from . import views

urlpatterns = [
    path('api/imp/gps-adjust/', views.get_adjusted_coords),
    path('api/imp/image-download/', views.image_download),
    path('api/imp/skyaye-heartbeat/', views.skyaye_heartbeat),
    path('api/imp/images/<image_name>', views.get_image),
    path('api/imp/objects/<object_name>', views.get_object),
]
