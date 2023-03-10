# https://docs.djangoproject.com/en/1.10/ref/settings/

import os

from decouple import config  # noqa

BASE_DIR = os.path.dirname(os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))))
# BASE_DIR = os.path.dirname(os.path.dirname(__file__))

ROOT_DIR = os.path.dirname(os.path.dirname(
    os.path.dirname(os.path.dirname(__file__))))


def base_dir_join(*args):
    return os.path.join(BASE_DIR, *args)


def frontend_dir_join(*args):
    return os.path.join(ROOT_DIR, 'api', 'frontend', *args)


SITE_ID = 1

SECURE_HSTS_PRELOAD = True

DEBUG = True

ADMINS = (
    ('UAS McFly', 'info@ubcuas.com'),
)

ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.messages',
    'django.contrib.sessions',
    'django.contrib.staticfiles',

    'imp_module.apps.ImpModuleConfig',
    'interop.apps.InteropConfig',
    'avoidance.apps.AvoidanceConfig',

    'background_task',
    'channels',
    'django_extensions',
    'django_js_reverse',
    'django_nose',
    'import_export',
    'rest_framework',
    'webpack_loader',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5000",
    "http://127.0.0.1:5000",
    "http://51.222.12.76:5000"
]

ROOT_URLCONF = 'gcomx.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [base_dir_join('templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
            ],
        },
    },
]

WSGI_APPLICATION = 'gcomx.wsgi.application'
ASGI_APPLICATION = 'gcomx.routing.application'
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": ["redis://gcomx-redis:6379/1"],
        },
    },
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Canada/Pacific'

USE_I18N = True

USE_L10N = True

USE_TZ = True

STATICFILES_DIRS = (
    frontend_dir_join('build'),
)

# Webpack
WEBPACK_LOADER = {
    'DEFAULT': {
        'CACHE': False,  # on DEBUG should be False
        'BUNDLE_DIR_NAME': 'build',
        'STATS_FILE': frontend_dir_join('webpack-stats.json'),
        'POLL_INTERVAL': 0.1,
        'IGNORE': ['.+\.hot-update.js', '.+\.map']
    }
}

# Celery
CELERY_BROKER_URL = 'redis://localhost:6379'
CELERY_RESULT_BACKEND = 'redis://localhost:6379'
CELERY_ACCEPT_CONTENT = ['application/json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'

CELERY_BEAT_SCHEDULE = {
    'periodic logging': {
        'task': 'interop.tasks.periodic_send',
        'schedule': 2.0,
    },
}

# ===========================
ENGINE_DEBUG = True
TIMEOUT = 10
GOTO_PRECISION = 1
DATA_LINK_REFRESH_RATE = 0.5
MISSION_REFRESH_RATE = 0.5
