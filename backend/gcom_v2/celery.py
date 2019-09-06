from __future__ import absolute_import

import os
import logging

from django.apps import apps

from celery import Celery
from django.conf import settings

logger = logging.getLogger(__name__)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "gcom_v2.settings.local")

app = Celery('gcom_v2')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

@app.task(bind=True)
def debug_task(self):
    logger.debug('Request: {0!r}'.format(self.request))