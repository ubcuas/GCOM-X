from django.db import models

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
        team_id: telemetry identifier team id
        latitude: Latitude in decimal degrees.
        longitude: Longitude in decimal degrees.
        altitude_msl: Altitude MSL in feet.
        uas_heading: Aircraft heading (true north) in degrees (0-360).
    """
    team_id = models.IntegerField(default=None)
    latitude = models.FloatField()
    longitude = models.FloatField()
    altitude_msl = models.FloatField()
    uas_heading = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    uploaded = models.BooleanField(default=False)

    # Altitude is in meters here
    def marshal(self):
        return {'team_id': self.team_id,
                'latitude': self.latitude,
                'longitude': self.longitude,
                'uas_heading': self.uas_heading,
                'altitude_msl': self.altitude_msl}

class Teams(models.Model):
    """
    Aircraft Teams Data.
    Obtained from competition server

    Attributes:
        team_id: telemetry identifier team id
        username: aircraft team username,
        name: aircraft team name,
        university: aicraft team university
    """
    team_id = models.IntegerField(default=None)
    username = models.CharField(max_length=256, blank=True)
    name = models.CharField(max_length=256, blank=True)
    university = models.CharField(max_length=256, blank=True)

    def __str__(self):
        return "team_id: %d username: %s name: %s university: %s" % (self.team_id, self.username,  self.name, self.university)
