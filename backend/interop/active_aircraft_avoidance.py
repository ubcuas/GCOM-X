import logging
import threading
import time

from interop.models import UasTelemetry, OtherAircraftTelemetry

logger = logging.getLogger(__name__)


class aaaThread(threading.Thread):
    conf = {
            'interval': 1,
        }

    def __init__(self, conf):
        threading.Thread.__init__(self)
        self.conf.update(conf)
        self.cont = True

    def run(self):
        logger.info("Aircraft Avoidance thread started")

        while self.cont:

            ### Aircraft Avoidance Work Goes Here ####
            print("hELLO!!!!!!")
            print("THis is a test")

            time.sleep(self.conf['interval'])

        logger.info("Aircraft Avoidance thread stopped")

    def update_conf(self, conf):
        self.conf = conf

    def stop(self):
        self.cont = False
        logger.info("Aircraft Avoidance thread is stopping")

    def is_running(self):
        return self.cont
