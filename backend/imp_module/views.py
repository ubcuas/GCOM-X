import logging
import json
import requests
import pyexiv2
from PIL import Image
from django.http import Http404, HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from imp_module.GPS_adjust import GPS_Image_Projector
from imp_module.models import ImpImage
from imp_module.image_download import ImageDownloader

from gcom_v2.settings.local_base import MEDIA_ROOT

IMAGES_DIR = MEDIA_ROOT + "/images/"

logger = logging.getLogger(__name__)


@csrf_exempt
@require_http_methods(['POST', 'DELETE', 'GET'])
def image_download(request):
    """Request to download images
    
    Returns:
        JsonResponse -- status true if downloading
    """
    if request.method == 'POST':
        if not image_download.download_thread or not image_download.download_thread.is_running():
            image_download.download_thread = ImageDownloader()
            image_download.download_thread.start()

    elif request.method == 'DELETE':
        if image_download.download_thread and image_download.download_thread.is_running():
            image_download.download_thread.stop()

    return JsonResponse({
        'status': image_download.download_thread and image_download.download_thread.is_running()
    })


image_download.download_thread = None


@csrf_exempt
@require_http_methods(['GET'])
def skyaye_heartbeat(request):
    SKYAYE_HEARTBEAT_ENDPOINT = 'http://192.168.1.103:5000/heartbeat'

    try:
        r = requests.get(SKYAYE_HEARTBEAT_ENDPOINT, timeout=1)
    except requests.exceptions.ConnectionError:
        return HttpResponse(status=503)

    if r.status_code != 200:
        return HttpResponse(status=r.status_code)

    return JsonResponse(r.json())


@csrf_exempt
def get_adjusted_coords(request):
    """
    Given an image and a pixel coordinate, returns the adjusted coordinates.
        :param request:
        :return JsonResponse of adjusted coords
        :raises 404 if image is not found
    """
    req_data = json.loads(request.body)
    try:
        image_data = {
            'image_name': req_data['image_name'],
            'percent_x': req_data['percent_x'],
            'percent_y': req_data['percent_y'],
        }

        if any([v is None for k,v in image_data.items()]):
            raise Exception("Some of the data is none: {}".format(image_data))
    except Exception as e:
        logger.warning("Invalid request: %s", e)
        return HttpResponse(status=401)

    try:
        image_object = ImpImage.objects.get(name=image_data['image_name'])
        image = Image.open(IMAGES_DIR + image_data['image_name'])
    except IOError:
        return Http404()

    metadata = pyexiv2.metadata.ImageMetadata(IMAGES_DIR + image_data['image_name'])
    metadata.read()
    if 'Exif.Photo.FocalLength' in metadata:
        fl = metadata.get('Exif.Photo.FocalLength').value
        focal_length = (fl.numerator, fl.denominator)
    else:
        logger.warning("Image had no focal length, using 25mm")
        focal_length = (250, 10)
    image.close()

    image_proj = GPS_Image_Projector((image_object.latitude, image_object.longitude), image_object.altitude, focal_length, image_object.roll, image)
    new_latitude, new_longitude = image_proj.percent_point_to_coord(image_data['percent_x'], image_data['percent_y'], image_object.heading)

    return JsonResponse({'latitude': new_latitude, 'longitude': new_longitude})

def get_image(request, image_name):
    """
    Displays a given source image
        :param request:
        :param image_name: image name to display
        :return HttpResponse of image
        :raises 404 if image is not found
    """
    return _display_image(MEDIA_ROOT + '/images/', image_name)

def get_object(request, object_name):
    """
    Displays a given object
        :param request:
        :param object_name: object name to display
        :return HttpResponse of object
        :raises 404 if object is not found
    """
    return _display_image(MEDIA_ROOT + '/objects/', object_name)

def _display_image(base_path, image):
    """
    Displays an image
        :param base_path: absolute base path of image
        :param image: image file name
        :return HttpResponse of image
        :raises 404 if image is not found
    """
    try:
        with open(base_path + image, 'rb') as img:
            return HttpResponse(img.read(), content_type="image")
    except IOError:
        raise Http404("Image not found")
