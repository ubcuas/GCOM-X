import os
from shutil import copyfile

from django.test import TestCase
from gcomx.settings.local import MEDIA_ROOT

class TestViews(TestCase):
    TESTS_DIR = MEDIA_ROOT + "/tests/"
    IMAGES_DIR = MEDIA_ROOT + "/images/"
    OBJECTS_DIR = MEDIA_ROOT + "/objects/"
    IMAGES_API = "/api/imp/images/"
    OBJECTS_API = "/api/imp/objects/"

    @classmethod
    def setUpClass(cls):
        copyfile(TestViews.TESTS_DIR + "2.JPEG", TestViews.OBJECTS_DIR + "2.JPEG")
        copyfile(TestViews.TESTS_DIR + "2.JPEG", TestViews.IMAGES_DIR + "2.JPEG")
        copyfile(TestViews.TESTS_DIR + "54.JPEG", TestViews.OBJECTS_DIR + "54.JPEG")
        copyfile(TestViews.TESTS_DIR + "54.JPEG", TestViews.IMAGES_DIR + "54.JPEG")

    def test_image(self):
        expected = self.client.get(TestViews.IMAGES_API + "2.JPEG").content
        with open(TestViews.TESTS_DIR + "2.JPEG", "rb") as image:
            actual = image.read()

        self.assertEqual(actual, expected)

        expected = self.client.get(TestViews.IMAGES_API + "54.JPEG").content
        with open(TestViews.TESTS_DIR + "54.JPEG", "rb") as image:
            actual = image.read()

        self.assertEqual(actual, expected)

    def test_object(self):
        expected = self.client.get(TestViews.OBJECTS_API + "2.JPEG").content
        with open(TestViews.OBJECTS_DIR + "2.JPEG", "rb") as image:
            actual = image.read()

        self.assertEqual(actual, expected)

        expected = self.client.get(TestViews.OBJECTS_API + "54.JPEG").content
        with open(TestViews.OBJECTS_DIR + "54.JPEG", "rb") as image:
            actual = image.read()

        self.assertEqual(actual, expected)

    def test_nonexistent_image(self):
        self.assertEqual(self.client.get(TestViews.IMAGES_API + "test").status_code, 404)
        self.assertEqual(self.client.get(TestViews.OBJECTS_API + "test").status_code, 404)

    @classmethod
    def tearDownClass(cls):
        os.remove(TestViews.OBJECTS_DIR + "2.JPEG")
        os.remove(TestViews.OBJECTS_DIR + "54.JPEG")
