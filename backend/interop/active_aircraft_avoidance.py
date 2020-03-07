import logging
import threading
import time
import sys
import os

from interop.models import UasTelemetry, OtherAircraftTelemetry

os.environ['DJANGO_SETTINGS_MODULE'] = 'mysite.settings'

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

            KM_PER_DEMICAL_DEG_LAT = 111.32
            FEET_PER_METER = 3.281
            M_PER_KM = 1000

            #time in seconds to predict into the future
            TIME_PREDICTION = 10


            # Aircraft Avoidance Work Goes Here#

            #Length in meters of 1° of longitude = 40075 km * cos( latitude ) / 360
            def get_longitude_meters(longitude, latitude):
                return longitude * 40075 * M_PER_KM * math.cos(latitude)/360

            #Length in meters of 1° of latitude = always 111.32 km
            def get_latitude_meters(latitude):
                return latitude * KM_PER_DEMICAL_DEG_LAT * M_PER_KM

            #calculates scope given 2 coordinates and delta t
            def slope(coordinate_2, coordinate_1, t):
                return (coordinate_2 - coordinate_1)/t

            #returns a tuple of slopes (slope of x, slope of y, slope of z)
            #param: 2 tuples and delta t, where each tuple is a (x,y,z) coordinate
            def get_slope_list(tuple_2, tuple_1, t):
                slopes = []
                for i in range(0,3):
                    slopes.append(slope(tuple_2[i], tuple_1[i], t))
                return slopes

            #param: slopes is a tuple of (slope of x, slope of y, slope of z)
            #       tuple_2 is the last coordinates (x,y,z)
            #returns: tuple, where each element is tuple_2[i] + slopes[i]*TIME_PREDICTION
            def get_predicted(slopes, tuple_2):
                predicted = []
                for i in range(0, 3):
                    # new_y = old_y + dy, where dy = m(dt), assume t = 1
                    predicted.append((slopes[i])*TIME_PREDICTION + tuple_2[i])
                return predicted

            #returns absolute value of tuple_1[i] - tuple_2[i] for all i ~ (0, 3)
            def get_abs_difference(tuple_1, tuple_2):
                abs_diff = []
                for i in range(0,3):
                    abs_diff.append(abs(tuple_1[i] - tuple_2[i]))
                return abs_diff

            #given 2 datetime objects, calculates total time difference in seconds
            def get_time_difference(time1, time2):
                return abs(time1 - time2).total_seconds()

            if UasTelemetry.objects.count() > 1 and OtherAircraftTelemetry.objects.count() > 1:
                uas_list = list(UasTelemetry.objects.all().order_by('-id')[:2])
                other_list = list(OtherAircraftTelemetry.objects.all().order_by('-id')[:2])

                # get x, y, z coordinates
                uas2 = (uas_list[0].longitude, uas_list[0].latitude, uas_list[0].altitude_msl)
                uas1 = (uas_list[1].longitude, uas_list[1].latitude, uas_list[1].altitude_msl)

                #get interval between uas2 and uas1 in seconds

                uas_t = get_time_difference(uas_list[0].created_at, uas_list[1].created_at)

                uas_slopes = get_slope_list(uas2, uas1, uas_t)
                uas_predicted = get_predicted(uas_slopes, uas2)

                for i in range (0,3):
                    print(uas_predicted[i])

                #for other aircraft
                other2 = (other_list[0].longitude, other_list[0].latitude, other_list[0].altitude_msl)
                other1 = (other_list[1].longitude, other_list[1].latitude, other_list[1].altitude_msl)

                other_t = get_time_difference(other_list[0].created_at, other_list[1].created_at)

                other_slopes = get_slope_list(other2, other1, other_t)
                other_predicted = get_predicted(other_slopes, other2)

                abs_diff = get_abs_difference(uas_predicted, other_predicted)

                metersApart = math.sqrt(get_longitude_meters(abs_diff[0], abs_diff[1])**2 \
                    + (get_latitude_meters(abs_diff[1]))**2 \
                    + (abs_diff[2] / FEET_PER_METER)**2)

                print(metersApart)

                if metersApart < 300:
                    print ("May collide! Will be", round(metersApart),  "m apart", int(TIME_PREDICTION), "s later!")

            time.sleep(self.conf['interval'])

        logger.info("Aircraft Avoidance thread stopped")

    def update_conf(self, conf):
        self.conf = conf

    def stop(self):
        self.cont = False
        logger.info("Aircraft Avoidance thread is stopping")

    def is_running(self):
        return self.cont
