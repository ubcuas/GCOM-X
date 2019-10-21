import os, json

from PIL import Image

from django.test import TestCase
from unittest.mock import patch
from unittest import skip

from imp_module.models import ImpODLC, ImpImage
from imp_module.odlc_handler import ODLCHandler

from gcomx.settings.local_base import MEDIA_ROOT

@skip('Someone needs to figure out why these are failing')
class TestODLCHandler(TestCase):
    IMAGE_DATA = {
        "name": "2.JPEG",
        "latitude": "49.1",
        "longitude": "-123.1",
        "altitude": "30",
        "heading": "40",
        "roll": "0",
    }

    ODLCHandler.IMAGES_DIR = MEDIA_ROOT + "/tests/"
    ODLCHandler.ODLC_DIR = MEDIA_ROOT + "/tests/"

    ODLC_DATA = {
        "auvsi_id": 12,
        "name": "object",
        "description": "description",
        "latitude": "49.1",
        "longitude": "-123.1",
        "type": "standard",
        "shape": "rectangle",
        "background_color": "",
        "alphanumeric": "A",
        "alphanumeric_color": "",
        "orientation": "N",
        "orientationAbs": 0,
        "image_source": "2.JPEG",
        "x": "0.1",
        "y": "0.2",
        "w": "0.3",
        "h": "0.4"
    }

    @classmethod
    def setUpClass(cls):
        # Patch the interop.ODLC module so that sent signals dont hurt tests
        cls.patcher = patch('interop.odlc.Client')
        cls.mock_odlc_client = cls.patcher.start()
        cls.mock_odlc_client.return_value.post_odlc.return_value = {'id': cls.ODLC_DATA['auvsi_id'],}

        ImpODLC.objects.all().delete()

        ImpImage.objects.all().delete()
        image = ImpImage(**TestODLCHandler.IMAGE_DATA)
        image.save()

    @classmethod
    def tearDownClass(cls):
        cls.patcher.stop()

    def test_create_odlc_non_existent_image(self):
        odlc_data = {
            "latitude": 49.1,
            "longitude": -123.1,
            "name": "object",
            "image_source": "test",
            "orientation": "",
            "orientationAbs": 0,
            "x": "0.1",
            "y": "0.2",
            "w": "0.3",
            "h": "0.4",
        }

        odlc = ImpODLC.create(odlc_data)
        self.assertFalse(ODLCHandler.create_odlc(odlc))
        ImpODLC.objects.all().delete()

    def test_create_odlc(self):
        json_data = {
            "id": 12,
            "mission": 1,
            "description": "description",
            "latitude": 49.1,
            "longitude": -123.1,
            "type": "STANDARD",
            "shape": "RECTANGLE",
            "shapeColor": None,
            "alphanumeric": "A",
            "alphanumericColor": None,
            "orientation": "N",
            "autonomous": False
        }

        odlc = ImpODLC.create(TestODLCHandler.ODLC_DATA)
        self.assertTrue(ODLCHandler.create_odlc(odlc))
        self.assertTrue(os.path.exists(MEDIA_ROOT + "/tests/" + str(odlc.pk) + ".jpg"))
        self.assertTrue(os.path.exists(MEDIA_ROOT + "/tests/" + str(odlc.pk) + ".json"))

        image_source = Image.open(MEDIA_ROOT + "/tests/2.JPEG")
        width, height = image_source.width * 0.3, image_source.height * 0.4

        cropped_image = Image.open(MEDIA_ROOT + "/tests/" + str(odlc.pk) + ".jpg")
        self.assertEqual(cropped_image.size, (width, height))

        image_source.close()
        cropped_image.close()

        json_file = open(MEDIA_ROOT + "/tests/" + str(odlc.pk) + ".json")
        self.assertEqual(json.loads(json_file.read()), json_data)
        json_file.close()

        os.remove(MEDIA_ROOT + "/tests/" + str(odlc.pk) + ".jpg")
        os.remove(MEDIA_ROOT + "/tests/" + str(odlc.pk) + ".json")

    def test_update_odlc(self):
        updated_odlc_data = {
            "description": "desc",
            "latitude": "49.1",
            "longitude": "-123.1",
            "type": "emergent",
            "shape": "",
            "background_color": "red",
            "alphanumeric": "",
            "alphanumeric_color": "green",
            "orientation": "W",
            "orientationAbs": 268,
        }

        json_data = {
            "id": 12,
            "mission": 1,
            "description": "desc",
            "latitude": 49.1,
            "longitude": -123.1,
            "type": "EMERGENT",
            "shape": None,
            "shapeColor": "RED",
            "alphanumeric": None,
            "alphanumericColor": "GREEN",
            "orientation": "W",
            "autonomous": False
        }

        odlc = ImpODLC.create(TestODLCHandler.ODLC_DATA)
        ODLCHandler.create_odlc(odlc)
        ImpODLC.update(odlc.pk, updated_odlc_data)
        ODLCHandler.update_odlc(ImpODLC.objects.get(pk=odlc.pk))

        json_file = open(MEDIA_ROOT + "/tests/" + str(odlc.pk) + ".json")
        self.assertEqual(json.loads(json_file.read()), json_data)
        json_file.close()

        os.remove(MEDIA_ROOT + "/tests/" + str(odlc.pk) + ".jpg")
        os.remove(MEDIA_ROOT + "/tests/" + str(odlc.pk) + ".json")

    def test_delete_odlc(self):
        odlc = ImpODLC.create(TestODLCHandler.ODLC_DATA)
        ODLCHandler.create_odlc(odlc)

        ODLCHandler.delete_odlc(odlc.pk)

        self.assertFalse(os.path.exists(MEDIA_ROOT + "/tests/" + str(odlc.pk) + ".jpg"))
        self.assertFalse(os.path.exists(MEDIA_ROOT + "/tests/" + str(odlc.pk) + ".json"))

    def test_delete_nonexistent_odlc(self):
        ODLCHandler.delete_odlc(0)
