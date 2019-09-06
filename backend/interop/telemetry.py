import logging
import threading
import time

from interop.models import UasTelemetry
from interop.client import Client

logger = logging.getLogger(__name__)


class telemThread(threading.Thread):
    conf = {
            'interval': 1,
        }

    def __init__(self, conf):
        threading.Thread.__init__(self)
        self.gcom_client = Client()
        self.conf.update(conf)
        self.cont = True

    def run(self):
        logger.info("Telem thread started")

        while self.cont:
            status = sendTelemetry(self.gcom_client)
            time.sleep(self.conf['interval'])

        logger.info("Telem thread stopped")

    def update_conf(self, conf):
        self.conf = conf

    def stop(self):
        self.cont = False
        logger.info("Telem thread is stopping")

    def is_running(self):
        return self.cont

def sendTelemetry(uasclient):
    from interop.views import get_connect_stat

    connected = get_connect_stat()
    if connected > 0:
        if UasTelemetry.objects.count() != 0:

            uas_telem = UasTelemetry.objects.latest('created_at')
            if not uas_telem.uploaded:
                try:
                    uasclient.post_telemetry(uas_telem.marshal())
                    connect_stat = 2
                    uas_telem.uploaded = True
                    uas_telem.save()
                    logger.debug('Posted telemtry data')
                    return True
                except Exception as error:
                    connect_stat = 3
                    logger.exception('Unable to send telemtry data error: %s' % error)
            else:
                logger.debug("No new telemtry!")
    else:
        logger.debug('UBC uas interop not connected or smurf not connected')
    return False