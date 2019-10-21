#!/usr/bin/env python

import os
import sys

from decouple import config


if __name__ == "__main__":
    settings_module = config('DJANGO_SETTINGS_MODULE', default=None)

    # Check that folders exist
    os.makedirs("mediafiles/images", exist_ok=True)
    os.makedirs("mediafiles/objects", exist_ok=True)
    os.makedirs("mediafiles/tmp_images", exist_ok=True)
    os.makedirs("staticfiles", exist_ok=True)

    # Check environment and settings
    if sys.argv[1] == 'test':
        if settings_module:
            print("Ignoring config('DJANGO_SETTINGS_MODULE') because it's test. "
                  "Using 'gcomx.settings.test'")
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "gcomx.settings.test")
    else:  # pragma: no cover
        if settings_module is None:
            print("Error: no DJANGO_SETTINGS_MODULE found. Will NOT start devserver. "
                  "Remember to create .env file at project root. "
                  "Check README for more info.")
            sys.exit(1)
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", settings_module)

    from django.core.management import execute_from_command_line



    execute_from_command_line(sys.argv)
