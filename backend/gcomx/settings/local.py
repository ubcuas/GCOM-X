from .base import *  # noqa

DEBUG = True

HOST = 'http://localhost:8000'

SECRET_KEY = 'secret'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'postgres',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': 'gcomx-db',
        'PORT': 5432,
    }
}

STATIC_ROOT = base_dir_join('staticfiles')
STATIC_URL = '/static/'

MEDIA_ROOT = base_dir_join('mediafiles')
MEDIA_URL = '/media/'

DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

AUTH_PASSWORD_VALIDATORS = []  # allow easy passwords only on local

# Celery
CELERY_TASK_ALWAYS_EAGER = True

# Email
INSTALLED_APPS += ('naomi',)
EMAIL_BACKEND = 'naomi.mail.backends.naomi.NaomiBackend'
EMAIL_FILE_PATH = base_dir_join('tmp_email')

# INTERNAL_IPS = ['127.0.0.1', '::1']

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'standard': {
            # 'format': '%(levelname)-8s [%(asctime)s] %(name)s: %(message)s'
            'format': '%(levelname)-8s [%(name)s]    %(message)s'
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'standard',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO'
        },
        'celery': {
            'handlers': ['console'],
            'level': 'INFO'
        },

        'interop': {
            'handlers': ['console'],
            'level': 'DEBUG'
        },
        'imp_module': {
            'handlers': ['console'],
            'level': 'DEBUG'
        },
        'avoidance': {
            'handlers': ['console'],
            'level': 'DEBUG'
        }
    }
}

JS_REVERSE_JS_MINIFY = False

ACOM_HOSTNAME='http://host.docker.internal:5000'