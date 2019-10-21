import logging
import os, os.path
import math
import ntpath
import traceback
import webp

from django.db import models, IntegrityError

from watchdog.events import FileSystemEventHandler
from watchdog.observers.inotify import InotifyObserver

from PIL import Image
from preconditions import preconditions

from imp_module.models import ImpImage
from imp_module.consumers import ImpImageConsumer
from imp_module import image_utils

from gcomx.settings.local_base import MEDIA_ROOT

import imp_module.geotag as geotag

logger = logging.getLogger(__name__)

IMAGES_DIR = MEDIA_ROOT + "/images/"

class ImageObserver:
    """
    ImageObserver that watches for modifications in the image directory
    """
    def __init__(self):
        self.image_observer = InotifyObserver()
        image_file_handler = ImageFileHandler(self.image_observer)

        self.image_observer.schedule(image_file_handler, IMAGES_DIR)
        self.image_observer.event_queue.maxsize = 1
        self.image_observer.start()

        ImageFileHandler.update_image_objects()

class ImageFileHandler(FileSystemEventHandler):
    """
    Handler for modifications in the image directory
    """
    def __init__(self, image_observer):
        """
        Creates a new ImageFileHandler
            :param image_observer: watchdog.observers.Observer
        """
        self.image_observer = image_observer

    def on_created(self, event):
        """
        On image file created handler
            :param event
        """
        self._handle_image_event()

    def on_deleted(self, event):
        """
        On image file deleted handler
            :param event
        """
        self._handle_image_event()

    def _handle_image_event(self):
        """
        General image event handler - updates database
        """
        self.image_observer.unschedule_all()
        ImageFileHandler.update_image_objects()
        ImpImageConsumer.update_image_data()
        self.image_observer.schedule(self, IMAGES_DIR)

    @staticmethod
    def update_image_objects():
        """
        Updates ImpImages based on current files in MEDIAROOT images folder
        If new images are created, add them
        If images are deleted, delete them
        """
        try:
            queryset = ImpImage.objects.all()
        except models.ObjectDoesNotExist:
            return
        else:
            # Check if the images in the queryset exists, if not delete
            for image in queryset:

                if not ImageFileHandler._file_exists(image.name):
                    ImpImage.objects.filter(name=image.name).delete()

            # Check if there are any images that are not in the database. If there is add and tag
            for image in sorted(os.listdir(IMAGES_DIR)):
                # If the file has already been added
                if ImpImage.objects.filter(name=image).exists():
                    continue

                try:
                    logger.debug("Creating ImpImage for %s", image)
                    result = ImageFileHandler._add_image_object(image)
                    if not result:
                        logger.error("Error creating impimage %s", image)
                except Exception as e:
                    logger.error("Error creating impimage %s: %s", image, e)
                    continue

    @staticmethod
    def _file_exists(name):
        """True if the file exist in the media/images folder
        precondition: the """
        path = IMAGES_DIR + name
        return os.path.exists(path) and os.path.isfile(path)

    @staticmethod
    @preconditions(lambda name: ImageFileHandler._file_exists(name))
    def _add_image_object(name):
        """
        Add an image object into the database
            :param name: requires name to represent a valid file in the MEDIAROOT images folder
            :return True if the image was added successfully, False otherwise
        """

        try:
            if not ImageFileHandler._check_file_type(name):
                return False

            # We already made sure that the image is JPEG format
            geotags = geotag.read_geo_tag(IMAGES_DIR + name)
            latitude = geotags['lat']
            longitude = geotags['lon']
            altitude = geotags['alt']
            heading = geotags['hdg']
            roll = geotags['roll']
            yaw = geotags['yaw']

            # Images must have valid GPS data
            attributes = (latitude, longitude, altitude, heading, roll)
            if any([a is None for a in attributes]):
                logger.error("Image %s does not contain valid GPS data. Data: %s", name, attributes)
                return False

        except Exception as e:
            traceback.print_tb(e.__traceback__)
        else:
            # Remove orientation tag from image to prevent automatic rotation
            image_utils.nuke_exif_orientation_tag(IMAGES_DIR + name)

            imp = ImpImage(name=name, processed_flag=0, latitude=latitude, longitude=longitude,
                            altitude=altitude, heading=heading, roll=roll)

            try:
                imp.save()
            except IntegrityError as e:
                logger.error("Error saving impimage to database: %s", e)
                return False

            return True

    @staticmethod
    @preconditions(lambda name: ImageFileHandler._file_exists(name))
    def _check_file_type(name):
        """
        Check if the file is a valid JPEG
            :param name: requires name to represent a valid file in the MEDIAROOT images folder
            :return True if the image is a valid JPEG, False otherwise
        """
        path = IMAGES_DIR + name

        try:
            image = Image.open(path)
        except Exception as e:
            traceback.print_tb(e.__traceback__)
            return False

        if image.format == "JPEG" or image.format == "MPO" or image.format == "WEBP":
            image.close()
            return True
        else:
            image.close()
            return False
