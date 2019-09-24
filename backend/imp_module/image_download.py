
import requests
import os
import shutil
import logging
import threading
import webp
import pyexiv2
from PIL import Image
from time import sleep

try:
    from gcom_v2.settings.local import MEDIA_ROOT
    from imp_module import geotag
except ModuleNotFoundError:
    MEDIA_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/mediafiles'
    import geotag

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

TYPE='tagged'
IMAGES_ENDPOINT = 'http://192.168.1.103:5000/images'
SRC_DIR = MEDIA_ROOT + '/tmp_images/'
DEST_DIR = MEDIA_ROOT + '/images/'

class ImageDownloader(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
        self.cont = True

    def stop(self):
        self.cont = False

    def is_running(self):
        return self.cont

    def run(self):
        logger.info("ImageDownloader thread started")
        ignore = set()

        while self.cont:
            try:
                images_list = requests.get(IMAGES_ENDPOINT, timeout=3).json()[TYPE]
                src_local_list = os.listdir(SRC_DIR)

                for image in images_list:
                    if not self.cont:
                        break

                    if image in src_local_list:
                        continue

                    r = requests.get(IMAGES_ENDPOINT + '/' + TYPE + '/' + image, timeout=3)
                    logging.info("Requesting: " + image + ", status: " + str(r.status_code))

                    with open(SRC_DIR + image, 'wb') as f:
                        f.write(r.content)

                    name, _ = os.path.splitext(SRC_DIR + image)
                    name = name.split('/')[-1]

                    if os.path.exists(DEST_DIR + name + '.webp') or (SRC_DIR + image) in ignore:
                        continue

                    try:
                        webp.save_image(Image.open(SRC_DIR + image), SRC_DIR + name + '.webp')

                        geotags = geotag.read_geo_tag(SRC_DIR + image)
                        latitude = geotags['lat']
                        longitude = geotags['lon']
                        altitude = geotags['alt']
                        heading = geotags['hdg']
                        roll = geotags['roll']

                        geotag.write_geo_tag(SRC_DIR + name + '.webp',
                                            latitude, longitude, altitude,
                                            hdg=heading, roll=roll)

                        jpg_metadata = pyexiv2.metadata.ImageMetadata(SRC_DIR + image)
                        jpg_metadata.read()
                        fl = None
                        if 'Exif.Photo.FocalLength' in jpg_metadata:
                            fl = jpg_metadata.get('Exif.Photo.FocalLength').value
                        webp_metadata = pyexiv2.metadata.ImageMetadata(SRC_DIR + name + '.webp')
                        webp_metadata.read()
                        webp_metadata['Exif.Photo.FocalLength'] = fl
                        webp_metadata.write()

                    except Exception as e:
                        # logger.error("Error ({}): ".format(image) + str(e))
                        ignore.add(SRC_DIR + image)
                        continue

                    shutil.move(SRC_DIR + name + '.webp', DEST_DIR)
                    logger.info("Saved " + SRC_DIR + name + '.webp')
                    sleep(1)
                sleep(1)
            except Exception as e:
                # logger.error("Error ({}): ".format(image) + str(e))
                sleep(3)

        logger.info("ImageDownloader thread stopped")


if __name__ == "__main__":
    im_down = ImageDownloader()
    im_down.start()
