import unittest
import math
from gcomx.settings.local import MEDIA_ROOT
from PIL import Image
from imp_module.GPS_adjust import GPS_Image_Projector

FUZZYNESS = 8
IMAGES_DIR = MEDIA_ROOT + "/tests/"

class TestGPSMethods(unittest.TestCase):
    def test_image_no_adjust(self):
        data = {
            "location": (48, -123),
            "altitude": 30,  # meters
            "focal_length": (500, 10),  # mm
            "roll_degrees": 0
        }
        image = Image.open(IMAGES_DIR + "2.JPEG")
        projector = GPS_Image_Projector(**data, image=image)

        original_point = (image.width / 2, image.height / 2)
        new_coords = projector.px_point_to_coord(*original_point, 0)

        for orig, new in zip(data['location'], new_coords):
            self.assertAlmostEqual(orig, new, places=FUZZYNESS)

    def test_image_no_adjust_with_roll(self):
        data = {
            "location": (48, -123),
            "altitude": 30,  # meters
            "focal_length": (500, 10),  # mm
            "roll_degrees": 17.733352088332534 / 2  # Half of the VFOV
        }
        image = Image.open(IMAGES_DIR + "2.JPEG")
        projector = GPS_Image_Projector(**data, image=image)

        original_point = (image.width / 2, 0)
        new_coords = projector.px_point_to_coord(*original_point, 0)

        for orig, new in zip(data['location'], new_coords):
            self.assertAlmostEqual(orig, new, places=FUZZYNESS)

    def test_image_no_adjust_very_high(self):
        data = {
            "location": (48, -123),
            "altitude": 90,  # meters
            "focal_length": (500, 10),  # mm
            "roll_degrees": 0
        }
        image = Image.open(IMAGES_DIR + "2.JPEG")
        projector = GPS_Image_Projector(**data, image=image)

        original_point = (image.width / 2, image.height / 2)
        new_coords = projector.px_point_to_coord(*original_point, 0)

        for orig, new in zip(data['location'], new_coords):
            self.assertAlmostEqual(orig, new, places=FUZZYNESS)

    def test_image_all_latitude(self):
        data = {
            "location": (48, -123),
            "altitude": 90,  # meters
            "focal_length": (500, 10),  # mm
            "roll_degrees": 45
        }
        expected = (48.00110908649007, -123)
        image = Image.open(IMAGES_DIR + "2.JPEG")
        projector = GPS_Image_Projector(**data, image=image)

        original_point = (image.width / 2, image.height)
        new_coords = projector.px_point_to_coord(*original_point, 0)

        for orig, new in zip(expected, new_coords):
            self.assertAlmostEqual(orig, new, places=FUZZYNESS)

    def test_image_all_longitude(self):
        data = {
            "location": (48, -123),
            "altitude": 90,  # meters
            "focal_length": (500, 10),  # mm
            "roll_degrees": 0
        }
        expected = (48, -123)
        image = Image.open(IMAGES_DIR + "2.JPEG")
        projector = GPS_Image_Projector(**data, image=image)

        original_point = (0, image.height / 2)
        new_coords_1 = projector.px_point_to_coord(*original_point, 0)

        original_point = (image.width, image.height / 2)
        new_coords_2 = projector.px_point_to_coord(*original_point, 0)

        # Latitude
        self.assertAlmostEqual(expected[0], new_coords_1[0], places=FUZZYNESS)
        self.assertAlmostEqual(expected[0], new_coords_2[0], places=FUZZYNESS)

        # Longitude
        self.assertTrue(expected[1] > new_coords_1[1])
        self.assertTrue(expected[1] < new_coords_2[1])
        self.assertAlmostEqual(expected[1], (new_coords_1[1] + new_coords_2[1])/2, places=FUZZYNESS)

    def test_image_percent_point_above(self):
        data = {
            "location": (48, -123),
            "altitude": 90,  # meters
            "focal_length": (500, 10),  # mm
            "roll_degrees": 0
        }
        expected = (48, -123)
        image = Image.open(IMAGES_DIR + "2.JPEG")
        projector = GPS_Image_Projector(**data, image=image)

        original_point = (0, 0.5)
        new_coords_1 = projector.percent_point_to_coord(*original_point, 0)

        original_point = (image.width / 2, image.height)
        new_coords_2 = projector.px_point_to_coord(*original_point, 0)

        # Latitude
        self.assertAlmostEqual(new_coords_2[0], new_coords_1[0], places=FUZZYNESS)
        self.assertTrue(expected[0] < new_coords_1[0])
        self.assertTrue(expected[0] < new_coords_2[0])

        # Longitude
        self.assertAlmostEqual(new_coords_2[1], new_coords_1[1], places=FUZZYNESS)
        self.assertAlmostEqual(expected[1], new_coords_1[1], places=FUZZYNESS)
        self.assertAlmostEqual(expected[1], new_coords_2[1], places=FUZZYNESS)

    def test_heading(self):
        data = {
            "location": (48, -123),
            "altitude": 30,  # meters
            "focal_length": (500, 10),  # mm
            "roll_degrees": 5,
        }
        expected = (48, -123)
        image = Image.open(IMAGES_DIR + "2.JPEG")
        projector = GPS_Image_Projector(**data, image=image)

        original_point = (image.width / 2, image.height)
        north_coords = projector.px_point_to_coord(*original_point, 0)
        east_coords = projector.px_point_to_coord(*original_point, 90)
        south_coords = projector.px_point_to_coord(*original_point, 180)
        west_coords = projector.px_point_to_coord(*original_point, 270)

        # Ensure that north and south are equal and opposite
        self.assertTrue(south_coords[0] < north_coords[0])
        self.assertAlmostEqual(expected[0], (north_coords[0] + south_coords[0])/2, places=FUZZYNESS)
        self.assertAlmostEqual(expected[1], north_coords[1], places=FUZZYNESS)
        self.assertAlmostEqual(expected[1], south_coords[1], places=FUZZYNESS)

        # Ensure that east and west are equal and opposite
        self.assertTrue(east_coords[1] < west_coords[1])
        self.assertAlmostEqual(expected[1], (east_coords[1] + west_coords[1])/2, places=FUZZYNESS)
        self.assertAlmostEqual(expected[0], east_coords[0], places=FUZZYNESS)
        self.assertAlmostEqual(expected[0], west_coords[0], places=FUZZYNESS)

if __name__ == '__main__':
    unittest.main()
