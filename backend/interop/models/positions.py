from django.db import models
from common.utils.conversions import meter_to_feet

class GpsPosition(models.Model):
    """GPS position consisting of a latitude and longitude degree value.
    This can be used for fly zone, drop location which represents an area or point on map

    Attributes:
        latitude: Latitude in degrees.
        longitude: Longitude in degrees.
    """
    latitude = models.FloatField(default=0.0)
    longitude = models.FloatField(default=0.0)

    def __str__(self):
        return "pk %d with lat: %f lon: %f" % (self.pk, self.latitude, self.longitude)

class UasTelemetry(models.Model):
    """
    Aircraft Telemetry Data.
    Filled in via smurf then packeged out and sent to competition server

    Attributes:
        latitude: Latitude in decimal degrees.
        longitude: Longitude in decimal degrees.
        altitude_msl: Altitude MSL in feet.
        uas_heading: Aircraft heading (true north) in degrees (0-360).
    """
    latitude = models.FloatField()
    longitude = models.FloatField()
    altitude_msl = models.FloatField()
    uas_heading = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    uploaded = models.BooleanField(default=False)

    def marshal(self):
        return {'latitude': self.latitude,
                'longitude': self.longitude,
                'heading': self.uas_heading,
                'altitude': meter_to_feet(self.altitude_msl)}

class OtherAircraftTelemetry(models.Model):
    """
    Aircraft Telemetry Data, from NOT our aircraft.
    Filled in via interop and used in the active aircraft avoidance.

    Attributes:
        latitude: Latitude in decimal degrees.
        longitude: Longitude in decimal degrees.
        altitude_msl: Altitude MSL in feet.
        uas_heading: Aircraft heading (true north) in degrees (0-360).
    """
    latitude = models.FloatField()
    longitude = models.FloatField()
    altitude_msl = models.FloatField()
    uas_heading = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    uploaded = models.BooleanField(default=False)

    def marshal(self):
        return {'latitude': self.latitude,
                'longitude': self.longitude,
                'heading': self.uas_heading,
                'altitude': meter_to_feet(self.altitude_msl)}
