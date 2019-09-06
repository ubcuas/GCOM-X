from django.test import TestCase
from imp_module import image_utils

class TestImageUtils(TestCase):
    def test_average_angle_none(self):
        self.assertRaises(ValueError, image_utils.average_angle, [])
    
    def test_average_angle_single(self):
        self.assertAlmostEqual(image_utils.average_angle([31.123]), 31.123)

    def test_average_angle_double(self):
        self.assertAlmostEqual(image_utils.average_angle([0, 90]), 45)
        self.assertAlmostEqual(image_utils.average_angle([350, 10]), 0)
        self.assertAlmostEqual(image_utils.average_angle([350.1, 169.9]), 80)
        
    def test_average_angle_triple(self):
        self.assertAlmostEqual(image_utils.average_angle([0, 90, 270]), 0)

    def test_average_angle_multiple(self):
        self.assertAlmostEqual(image_utils.average_angle([100, 260, 170, 190]), 180)

    def test_orientation_number_to_letter_middles(self):
        self.assertEqual(image_utils.orientation_number_to_letter(0), 'N')
        self.assertEqual(image_utils.orientation_number_to_letter(45), 'NE')
        self.assertEqual(image_utils.orientation_number_to_letter(90), 'E')
        self.assertEqual(image_utils.orientation_number_to_letter(135), 'SE')
        self.assertEqual(image_utils.orientation_number_to_letter(180), 'S')
        self.assertEqual(image_utils.orientation_number_to_letter(225), 'SW')
        self.assertEqual(image_utils.orientation_number_to_letter(270), 'W')
        self.assertEqual(image_utils.orientation_number_to_letter(315), 'NW')

    def test_orientation_number_to_letter_off(self):
        self.assertEqual(image_utils.orientation_number_to_letter(22), 'N')
        self.assertEqual(image_utils.orientation_number_to_letter(67), 'NE')
        self.assertEqual(image_utils.orientation_number_to_letter(112), 'E')
        self.assertEqual(image_utils.orientation_number_to_letter(157), 'SE')
        self.assertEqual(image_utils.orientation_number_to_letter(202), 'S')
        self.assertEqual(image_utils.orientation_number_to_letter(247), 'SW')
        self.assertEqual(image_utils.orientation_number_to_letter(292), 'W')
        self.assertEqual(image_utils.orientation_number_to_letter(337), 'NW')

    def test_orientation_number_to_letter_invalid(self):
        self.assertRaises(ValueError, image_utils.orientation_number_to_letter, -12)
        self.assertRaises(ValueError, image_utils.orientation_number_to_letter, 360)

    def test_gps_centroid_invalid(self):
        self.assertRaises(ValueError, image_utils.gps_centroid, [], [1])
        self.assertRaises(ValueError, image_utils.gps_centroid, [1], [1, 2])

    def test_gps_centroid_single(self):
        self.assertAlmostEqual(image_utils.gps_centroid(
            [49.123], [-123.123]
        ), (49.123, -123.123))
        self.assertAlmostEqual(image_utils.gps_centroid(
            [-32.987654321], [180]
        ), (-32.987654321, 180))

    def test_gps_centroid_double(self):
        centroid = image_utils.gps_centroid([38.148077, 38.144756], [-76.418522, -76.428026])

        self.assertAlmostEqual(centroid[0], 38.1464166)
        self.assertAlmostEqual(centroid[1], -76.4232741)
    
    def test_gps_centroid_triple(self):
        centroid = image_utils.gps_centroid(
            [38.144134, 38.145408, 38.1459237], [-76.429789, -76.426463, -76.42916]
        )

        self.assertAlmostEqual(centroid[0], 38.1451552)
        self.assertAlmostEqual(centroid[1], -76.4284707)