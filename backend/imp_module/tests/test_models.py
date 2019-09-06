from decimal import Decimal

from django.test import TestCase
from unittest.mock import patch

from imp_module.models import ImpImage, ImpODLC

class TestModels(TestCase):
    IMAGE_DATA = {
        "name": "image1",
        "latitude": "49.1",
        "longitude": "-123.1",
        "altitude": "30",
        "heading": "40",
        "roll": "23.2",
    }

    OBJECT_DATA = {
        "auvsi_id": 12,
        "name": "object",
        "description": "description",
        "latitude": "49.1",
        "longitude": "-123.1",
        "type": "standard",
        "shape": "rectangle",
        "background_color": "green",
        "alphanumeric": "A",
        "alphanumeric_color": "red",
        "orientation": "N",
        "orientationAbs": 0,
        "image_source": "image.jpg",
        "x": "0.1",
        "y": "0.2",
        "w": "0.3",
        "h": "0.4",
    }

    @classmethod
    def setUpClass(cls):
        # Patch the interop.ODLC module so that sent signals dont hurt tests
        cls.patcher = patch('interop.odlc.Client')
        cls.mock_odlc_client = cls.patcher.start()
        cls.mock_odlc_client.return_value.post_odlc.return_value = {'id': cls.OBJECT_DATA['auvsi_id'],}

        image = ImpImage(**TestModels.IMAGE_DATA)
        image.save()
        ImpODLC.create(TestModels.OBJECT_DATA)

    @classmethod
    def tearDownClass(cls):
        cls.patcher.stop()

    def test_imp_image_save(self):
        expected_image_data = {
            "id": 1,
            "name": "image1",
            "processed_flag": 0,
            "latitude": Decimal("49.10000000"),
            "longitude": Decimal("-123.10000000"),
            "altitude": Decimal("30.0000"),
            "heading": 40,
            "roll": 23.2000
        }

        self.assertEqual(ImpImage.objects.values()[0], expected_image_data)

    def test_imp_image_update(self):
        expected_image_data = {
            "id": 1,
            "name": "image1",
            "processed_flag": 1,
            "latitude": Decimal("49.10000000"),
            "longitude": Decimal("-123.10000000"),
            "altitude": Decimal("30.0000"),
            "heading": 40,
            "roll": 23.2000
        }

        ImpImage.update(1, {
            "processed_flag": 1,
        })

        self.assertEqual(ImpImage.objects.values()[0], expected_image_data)

    def test_imp_object_create(self):
        expected_object_data = {
            "id": 1,
            "auvsi_id": 12,
            "name": "object",
            "description": "description",
            "latitude": Decimal("49.10000000"),
            "longitude": Decimal("-123.10000000"),
            "latitudes": [Decimal("49.10000000")],
            "longitudes": [Decimal("-123.10000000")],
            "type": "standard",
            "shape": "rectangle",
            "background_color": "green",
            "alphanumeric": "A",
            "alphanumeric_color": "red",
            "orientation": "N",
            "orientationAbss": [Decimal("0.0000")],
            "image_source": "image.jpg",
            "image_source_model_id": None,
            "x": Decimal("0.10000"),
            "y": Decimal("0.20000"),
            "w": Decimal("0.30000"),
            "h": Decimal("0.40000"),
        }

        self.assertEqual(ImpODLC.objects.values()[0], expected_object_data)

    def test_imp_object_update(self):
        expected_object_data = {
            "id": 1,
            "auvsi_id": 12,
            "name": "name",
            "description": "desc",
            "latitude": Decimal("49.10000000"),
            "longitude": Decimal("-123.10000000"),
            "latitudes": [Decimal("49.10000000")],
            "longitudes": [Decimal("-123.10000000")],
            "type": "emergent",
            "shape": "circle",
            "background_color": "red",
            "alphanumeric": "1",
            "alphanumeric_color": "green",
            "orientation": "W",
            "orientationAbss": [Decimal("270.0000")],
            "image_source": "image.jpg",
            "image_source_model_id": None,
            "x": Decimal("0.10000"),
            "y": Decimal("0.20000"),
            "w": Decimal("0.30000"),
            "h": Decimal("0.40000"),
        }

        ImpODLC.update(1, {
            "name": "name",
            "description": "desc",
            "type": "emergent",
            "shape": "circle",
            "background_color": "red",
            "alphanumeric": "1",
            "alphanumeric_color": "green",
            "orientation": "W",
            "orientationAbs": 270,
        })

        self.assertEqual(ImpODLC.objects.values()[0], expected_object_data)

    def test_imp_object_combine(self):
        expected_object_data = {
            "id": 1,
            "auvsi_id": 12,
            "name": "object",
            "description": "description",
            "latitude": Decimal("49.15001079"),
            "longitude": Decimal("-123.14994954"),
            "latitudes": [Decimal("49.10000000"), Decimal("49.20000000")],
            "longitudes": [Decimal("-123.10000000"), Decimal("-123.20000000")],
            "type": "standard",
            "shape": "rectangle",
            "background_color": "green",
            "alphanumeric": "A",
            "alphanumeric_color": "red",
            "orientation": "NE",
            "orientationAbss": [Decimal("0.0000"), Decimal("90.0000")],
            "image_source": "image.jpg",
            "image_source_model_id": None,
            "x": Decimal("0.10000"),
            "y": Decimal("0.20000"),
            "w": Decimal("0.30000"),
            "h": Decimal("0.40000"),
        }

        ImpODLC.combine(1, {
            "latitude": "49.20000000",
            "longitude": "-123.20000000",
            "orientation": "E",
            "orientationAbs": 90,
        })

        self.assertEqual(ImpODLC.objects.values()[0], expected_object_data)

    def test_imp_object_delete(self):
        ImpODLC.delete(1)

        self.assertEqual(len(ImpODLC.objects.values()), 0)

    @classmethod
    def tearDownClass(cls):
        pass
