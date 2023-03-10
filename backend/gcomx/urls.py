from django.conf import settings
from django.conf.urls import include, url  # noqa
from django.urls import path
from django.contrib import admin
from django.views.generic import TemplateView

import django_js_reverse.views

from . import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^jsreverse/$', django_js_reverse.views.urls_js, name='js_reverse'),

    url('avoidance/', include('avoidance.urls')),
    url("", include('imp_module.urls')),
    url("", include('interop.urls')),
    url(r'^$', TemplateView.as_view(template_name='gcomx/index.html'), name='home'),
]


if settings.DEBUG:
    # import debug_toolbar
    urlpatterns = [
        # url(r'^__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
