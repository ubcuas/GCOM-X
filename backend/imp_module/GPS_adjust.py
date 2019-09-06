import utm
import math
from PIL import Image

# Constants
SENSOR_WIDTH = 23.5                # mm
SENSOR_HEIGHT = 15.6               # mm
PITCH = 0.0                        # pitch is assumed to be 0
EARTH_R = 6.3781e6                 # m

# Class that allows for GPS adjustment
class GPS_Image_Projector():
    def __init__(self, location, altitude, focal_length, roll_degrees, image):
        self.conv_location = utm.from_latlon(*location)  # Convert the location to it's UTM values
        angle = math.radians(roll_degrees)

        # Field of view calculations
        focal_length = focal_length[0] / focal_length[1]  # Convert exif info into mm
        hfov = 2 * math.atan(SENSOR_WIDTH/(2*focal_length))
        vfov = 2 * math.atan(SENSOR_HEIGHT/(2*focal_length))

        self.angle = angle
        self.altitude = float(altitude)  # Convert from decimal.Decimal to float

        # Find where the ground plane intersects the bottom of the vertical FOV -- (ALPHA)
        alpha_angle = angle - (vfov/2)
        orig_alpha = self.altitude * math.tan(alpha_angle)

        # Find where the ground plane intersects the top of the vertical FOV -- (BETA)
        beta_angle = angle + (vfov/2)
        orig_beta = self.altitude * math.tan(beta_angle)

        # Find the distance between the camera and point alpha -- (GAMMA to ALPHA)
        gamma_alpha = math.sqrt(self.altitude**2 + orig_alpha**2)

        # Find the height of the image as projected (ALPHA to SIGMA, Orthagonal to the center of the FOV)
        alpha_beta = orig_beta - orig_alpha
        half_img_scale = gamma_alpha * math.sin(vfov/2)
        alpha_sigma = abs(2 * half_img_scale)

        # Calculate the scale of the image (m / px) when it is projected, in the vertical direction
        self.img_scale_height = alpha_sigma / image.height

        # Find the vertical midpoint in px and meters
        self.half_img_height_px = image.height / 2
        half_img_height_m = self.half_img_height_px * self.img_scale_height

        # Find the distance from the camera to the cetner of the image, in the vertical direction
        self.gamma_imgmid = math.sqrt(gamma_alpha**2 - half_img_height_m**2)

        # Find the horizontal image scale (radians / px)
        self.img_scale_width = hfov / image.width
        self.img_center_width = hfov / 2

        # Store image values for later use
        self.image_height = image.height
        self.image_width = image.width

    def percent_point_to_coord(self, percent_x, percent_y, heading):
        """Percent is percent from center of image"""
        # Convert point to px point from bottom corner
        x = (percent_x * self.image_width) + (self.image_width / 2)
        y = (percent_y * self.image_height) + (self.image_height / 2)
        return self.px_point_to_coord(x, y, heading)

    def px_point_to_coord(self, x, y, heading):
        """px_point is pixel value from bottom left corner of the image."""
        new_point = self._project_px_point(x, y)
        new_location = self._convert_point_to_latlong(*new_point, heading)
        return new_location

    def px_square_to_coord(self, x1, y1, x2, y2, heading):
        npbl = self._project_px_point(x1, y1)
        nptr = self._project_px_point(x2, y2)
        new_point = ( (npbl[0]+npbl[0])/2 , npbl[1]+npbl[1]/2 )
        new_location = self._convert_point_to_latlong(*new_point, heading)
        return new_location

    def _project_px_point(self, x, y):
        return (self._project_x(x), self._project_y(y))

    def _project_x(self, x):
        x_angle = x * self.img_scale_width
        x_angle_mid_adjusted = x_angle - self.img_center_width

        delta_x = self.altitude * math.tan(x_angle_mid_adjusted)
        return delta_x

    def _project_y(self, y):
        # Find the distance to the center of the projected image
        mid_y_px = y - self.half_img_height_px
        mid_y_m = mid_y_px * self.img_scale_height

        # Find the angle between the center of FOV and the y value
        y_angle = math.atan(mid_y_m / self.gamma_imgmid)

        # Add that to the camera angle to get the overall angle
        camera_angle_prime = self.angle + y_angle

        # Calculate the y value as projected through the image to the ground
        delta_y = self.altitude * math.tan(camera_angle_prime)
        return delta_y

    def _convert_point_to_latlong(self, x, y, heading):
        # Rotate around the origin
        heading = math.radians(heading)
        x_o_prime = x * math.cos(heading) - y * math.sin(heading)
        y_o_prime = y * math.cos(heading) - x * math.sin(heading)

        # Add the offsets to the original location
        utm_prime = (self.conv_location[0]+x_o_prime, self.conv_location[1]+y_o_prime)
        return utm.to_latlon(*utm_prime, *self.conv_location[2:])


# def GPS_adjust(lat_original, long_original, altitude, roll, heading):
#     '''
#     Returns the adjusted lattitude and longitude coordinates at the center of an image
#         apply reverse haversine to derive lat/long from start point, bearing, and distance
#         Haversine Formula
#         φ: latitude
#         λ: longitude
#         φ2 = asin( (sin φ1 ⋅ cos δ) + (cos φ1 ⋅ sin δ ⋅ cos θ) )
#         λ2 = λ1 + atan2( sin θ ⋅ sin δ ⋅ cos φ1, cos δ − sin φ1 ⋅ sin φ2 )

#     input: lat_original: original lattitude in
#         long_original: original longitutde
#         altitude: altitude in meters
#         roll: roll in radian
#         heading: heading in degrees

#     return: lat_new: new lattitude
#             long_new: new longitude
#     '''
#     #convert lattitude and longitude into radians
#     lat_original_rad = math.radians(lat_original)
#     long_original_rad = math.radians(long_original)
#     heading_rad = math.radians(heading)

#     drone_to_img_center = altitude*math.tan(roll)

#     delta = drone_to_img_center / EARTH_R
#     lat_new_rad = math.asin(math.sin(lat_original_rad) * math.cos(delta) + math.cos(lat_original_rad) * math.sin(delta)*math.cos(heading_rad) )
#     long_new_rad = long_original_rad + math.atan2(math.sin(heading_rad)*math.sin(delta)*math.cos(lat_original_rad), math.cos(delta)-math.sin(lat_original_rad)*math.sin(lat_new_rad))

#     lat_new = math.degrees(lat_new_rad)
#     long_new = math.degrees(long_new_rad)
#     return lat_new, long_new
