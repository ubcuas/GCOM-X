from django.conf.urls import url

from imp_module import consumers
from imp_module.image_observer import ImageObserver

websocket_urlpatterns = [
    url(r'^ws/imp/image/$', consumers.ImpImageConsumer.as_asgi()),
    url(r'^ws/imp/object/$', consumers.ImpObjectConsumer.as_asgi()),
]

ImageObserver()
