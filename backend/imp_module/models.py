from django.db import models
from django.db.models.signals import pre_save, pre_delete
from django.contrib.postgres.fields import ArrayField
from django.forms import model_to_dict

from interop import odlc as interop_odlc
from .image_utils import average_angle, orientation_number_to_letter, gps_centroid


class ImpImage(models.Model):
    """
    Represents an image file in MEDIAROOT/images folder.
    Note: The image objects are identified by their name, so image names must be unique
    """
    name = models.TextField(default="", unique=True)
    processed_flag = models.IntegerField(default=0)

    latitude = models.DecimalField(default=0, max_digits=11, decimal_places=8)
    longitude = models.DecimalField(default=0, max_digits=11, decimal_places=8)
    altitude = models.DecimalField(default=0, max_digits=7, decimal_places=4)
    heading = models.IntegerField(default=0)
    roll = models.FloatField(default=0)

    @classmethod
    def update(cls, pk, data):
        """
        Updates an ImpImage object
            :param pk: primary key
            :param data: dict data to update
        """
        cls.objects.filter(pk=pk).update(**data)


class ImpODLC(models.Model):
    """
    Represents an AUVSI ODLC (Object Detection, Localization, Classification)
    """
    auvsi_id = models.IntegerField(null=True)
    name = models.TextField(default="")
    description = models.TextField(default="", blank=True)

    latitude = models.DecimalField(default=0, max_digits=11, decimal_places=8)
    longitude = models.DecimalField(default=0, max_digits=11, decimal_places=8)
    latitudes = ArrayField(
        models.DecimalField(default=0, max_digits=11, decimal_places=8),
        default=list
    )
    longitudes = ArrayField(
        models.DecimalField(default=0, max_digits=11, decimal_places=8),
        default=list
    )

    type = models.TextField(default="", blank=True)
    shape = models.TextField(default="", blank=True)
    background_color = models.TextField(default="", blank=True)

    alphanumeric = models.TextField(default="", blank=True)
    alphanumeric_color = models.TextField(default="", blank=True)
    orientation = models.TextField(default="", blank=True)
    orientationAbss = ArrayField(
        models.DecimalField(default=0, max_digits=7, decimal_places=4),
        default=list
    )

    image_source = models.TextField(default="")
    image_source_model = models.ForeignKey('ImpImage', on_delete=None, null=True)
    x = models.DecimalField(default=0, max_digits=6, decimal_places=5)
    y = models.DecimalField(default=0, max_digits=6, decimal_places=5)
    w = models.DecimalField(default=0, max_digits=6, decimal_places=5)
    h = models.DecimalField(default=0, max_digits=6, decimal_places=5)

    @classmethod
    def create(cls, data):
        """
        Creates a new ImpODLC object
            :param data: dict data for ImpODLC
            :return odlc created
        """
        data_cpy = dict(data)
        data_cpy["latitudes"] = [data_cpy["latitude"]]
        data_cpy["longitudes"] = [data_cpy["longitude"]]
        data_cpy["orientationAbss"] = [] if data_cpy["orientation"] == '' \
            else [data_cpy["orientationAbs"]]
        del data_cpy["orientationAbs"]

        odlc = cls(**data_cpy)
        odlc.save()

        return odlc

    @classmethod
    def update(cls, pk, data):
        """
        Updates an ImpODLC object
            :param pk: primary key
            :param data: dict data to update
        """
        data_cpy = dict(data)
        objs = cls.objects.filter(pk=pk)
        if "orientationAbs" in data_cpy:
            data_cpy["orientationAbss"] = [data_cpy["orientationAbs"]]
            del data_cpy["orientationAbs"]
        
        objs.update(**data_cpy)
        pre_save.send(ImpODLC, instance=objs.first())

    @classmethod
    def delete(cls, pk):
        """
        Deletes an ImpODLC object
            :param pk: primary key
        """
        cls.objects.filter(pk=pk).delete()

    @classmethod
    def combine(cls, pk, data):
        """
        Combines an ImpODLC object with an existing one
            :param pk: primary key
            :param data: dict data
        """
        obj = cls.objects.get(pk=pk)

        obj.latitudes.append(data['latitude'])
        obj.longitudes.append(data['longitude'])
        if data['orientation'] != '':
            obj.orientationAbss.append(data['orientationAbs'])
            obj.orientation = orientation_number_to_letter(average_angle(
                list(float(x) for x in obj.orientationAbss)
            ))

        lats = list(float(x) for x in obj.latitudes)
        lons = list(float(x) for x in obj.longitudes)
        obj.latitude, obj.longitude = gps_centroid(lats, lons)

        obj.save()


pre_save.connect(interop_odlc.post_or_put_odlc, sender=ImpODLC)
pre_delete.connect(interop_odlc.delete_odlc, sender=ImpODLC)
