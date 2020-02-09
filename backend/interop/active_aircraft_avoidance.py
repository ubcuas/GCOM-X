import logging
import threading
import time
import sys
import os

from gps.models import UasTelemetry, OtherAircraftTelemetry

print('\n'.join(sys.path))

os.environ['DJANGO_SETTINGS_MODULE'] = 'mysite.settings'


logger = logging.getLogger(__name__)
print('HI')


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

            # Aircraft Avoidance Work Goes Here#
            print("hELLO!!!!!!")
            print("THis is a test")
            
            uas_list = list(UasTelemetry.objects.all().order_by('-id')[:2])
            other_list = list(OtherAircraftTelemetry.objects.all().order_by('-id')[:2])

            # get x, y, z coordinates
            uas2 = (uas_list[0].longitude, uas_list[0].latitude, uas_list[0].altitude_msl)
            uas1 = (uas_list[1].longitude, uas_list[1].latitude, uas_list[1].altitude_msl)

            #get interval between uas2 and uas1 in seconds
            uas_timedelta = uas_list[0].created_at - uas_list[1].created_at
            uas_t = uas_timedelta.total_seconds()


            uas_slopes = []
            for i in range(0, 3):
                uas_slopes.append(slope(uas2[i], uas1[i], uas_t))
    

            #other2 = (other_list[0].longitude, other_list[0].latitude, other_list[0].altitude_msl)
            #other1 = (other_list[1].longitude, other_list[1].latitude, other_list[1].altitude_msl)

            def getSlopeList(tuple2, tuple1):
                slopes = []
                for i in range(0,3):
                    slopes.append()

            def slope(coordinate2, coordinate1, t):
                return (coordinate2-coordinate1)/t


            time.sleep(self.conf['interval'])

        logger.info("Aircraft Avoidance thread stopped")

    def update_conf(self, conf):
        self.conf = conf

    def stop(self):
        self.cont = False
        logger.info("Aircraft Avoidance thread is stopping")

    def is_running(self):
        return self.cont
