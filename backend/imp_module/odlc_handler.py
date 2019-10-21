import logging
import json, os
from PIL import Image
from gcomx.settings.local_base import MEDIA_ROOT
from imp_module.models import ImpImage
from interop.odlc import convert_odlc_to_json

logger = logging.getLogger(__name__)


class ODLCHandler:
    """
    Creates, saves, and deletes AUVSI ODLC images and json files
    """
    ODLC_DIR = MEDIA_ROOT + "/objects/"
    IMAGES_DIR = MEDIA_ROOT + "/tmp_images/"

    @staticmethod
    def create_odlc(odlc):
        """
        Creates a cropped image and json file for the given odlc
            :param odlc contains all fields in ImpODLC model
            :return True is image and json was created and saved successfully,
                    False otherwise
        """
        image_source = os.path.splitext(odlc.image_source)[0] + '.jpg'

        try:
            image = Image.open(ODLCHandler.IMAGES_DIR + image_source)
        except IOError:
            return False

        width, height = image.size
        x_1 = width * float(odlc.x)
        y_1 = height * float(odlc.y)
        x_2 = width * (float(odlc.x) + float(odlc.w))
        y_2 = height * (float(odlc.y) + float(odlc.h))

        cropped_image_file_name = ODLCHandler.ODLC_DIR + str(odlc.pk) + ".jpg"
        cropped_image = image.crop((x_1, y_1, x_2, y_2))
        cropped_image.save(cropped_image_file_name)
        cropped_image.close()

        # Add in th foreign-key link to the ImpImage
        odlc.image_source_model = ImpImage.objects.get(name=odlc.image_source)

        odlc.save()
        ODLCHandler._write_odlc_json(odlc)

        return True

    @staticmethod
    def update_odlc(odlc):
        """
        Updates the json file for the given odlc
            :param odlc contains all fields in ImpODLC model
            :return True is json was updated and saved successfully,
                    False otherwise
        """
        return ODLCHandler._write_odlc_json(odlc)

    @staticmethod
    def delete_odlc(pk):
        """
        Deletes the cropped image and json for the given pk number
            :param pk of odlc to delete
        """
        try:
            os.remove(ODLCHandler.ODLC_DIR + str(pk) + ".jpg")
            os.remove(ODLCHandler.ODLC_DIR + str(pk) + ".json")
        except FileNotFoundError:
            pass

    @staticmethod
    def _write_odlc_json(odlc):
        """
        Writes to the json file for the given odlc
            :param odlc contains all fields in ImpODLC model
        """
        json_file = open(ODLCHandler.ODLC_DIR + str(odlc.pk) + ".json", "w")

        json_file.write(json.dumps(convert_odlc_to_json(odlc), indent=4))
        json_file.close()
