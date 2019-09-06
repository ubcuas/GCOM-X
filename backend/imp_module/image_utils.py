import pyexiv2
from cmath import rect, phase
from math import radians, degrees, ceil, cos, sin, atan2, sqrt
from shapely.geometry import MultiPoint


def nuke_exif_orientation_tag(img_path):
    """
    Deletes EXIF tags from image so that orientation doesn't matter.
    """
    metadata = pyexiv2.ImageMetadata(img_path)
    metadata.read()

    tag = 'Exif.Image.Orientation'

    if tag not in metadata:
        return

    if metadata[tag].value == 1:
        return

    metadata[tag] = pyexiv2.ExifTag(tag, 1)

    metadata.write()


def average_angle(angles):
    """Calculates average angle in a list of angles in degrees
    
    Arguments:
        angles {list(float)} -- List of angles in degrees
    
    Returns:
        float -- average angle in degrees
    """
    if len(angles) == 0:
        raise ValueError("Cannot find the average angle of an empty list")

    avg = degrees(phase(sum(rect(1, radians(o)) for o in angles) / len(angles)))

    if avg >= 360:
        avg -= 360
    elif avg < 0:
        avg += 360

    return avg % 360


def orientation_number_to_letter(orientation):
    """Converts orientation in degees to direction
    
    Arguments:
        orientation {float} -- orientation in degrees [0, 360)
    
    Raises:
        ValueError: If orientation is out of bounds
    
    Returns:
        str -- one of ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    """
    orientation_letters = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']

    if orientation >= 360 or orientation < 0:
        raise ValueError("Orientation must be in the range [0, 360).")

    return orientation_letters[
        0 if (orientation > 337.5 or orientation <= 22.5) else ceil((orientation - 22.5) / 45)
    ]


def gps_centroid(lats, lons):
    """Finds the centroid of a set of points
    
    Arguments:
        lats {list(float)} -- list of latitudes
        lons {list(float)} -- list of longitudes
    
    Returns:
        (float, float) -- lat, lon of centroid
    """
    if len(lats) == 0 or len(lons) == 0 or len(lats) != len(lons):
        raise ValueError("Invalid lats lons arguments")

    lats_rad = map(lambda x: radians(x), lats)
    lons_rad = map(lambda x: radians(x), lons)
    cart_coords = list(map(lambda latlon: (cos(latlon[0]) * cos(latlon[1]),
                                            cos(latlon[0]) * sin(latlon[1]),
                                            sin(latlon[0])),
        zip(lats_rad, lons_rad)))

    avg_x = sum(map(lambda coords: coords[0], cart_coords)) / len(cart_coords)
    avg_y = sum(map(lambda coords: coords[1], cart_coords)) / len(cart_coords)
    avg_z = sum(map(lambda coords: coords[2], cart_coords)) / len(cart_coords)
    
    avg_lon = atan2(avg_y, avg_x)
    hyp = sqrt(avg_x * avg_x + avg_y * avg_y)
    avg_lat = atan2(avg_z, hyp)

    return degrees(avg_lat), degrees(avg_lon)