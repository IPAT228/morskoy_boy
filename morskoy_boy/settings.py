"""
Django settings for morskoy_boy project.
Обучающая игра по информатике на основе «Морского боя»
"""

from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

IS_VERCEL = os.environ.get('VERCEL') == '1'

if not IS_VERCEL:
    try:
        from dotenv import load_dotenv

        load_dotenv(BASE_DIR / '.env')
    except ImportError:
        pass

from morskoy_boy.database import get_database_url

SECRET_KEY = os.environ.get(
    'SECRET_KEY',
    'django-insecure-morskoy-boy-edu-game-2026-secret-key',
)

DEBUG = os.environ.get('DEBUG', 'false' if IS_VERCEL else 'true').lower() == 'true'

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '.vercel.app']
if os.environ.get('VERCEL_URL'):
    ALLOWED_HOSTS.append(os.environ['VERCEL_URL'])

CSRF_TRUSTED_ORIGINS = []
for env_key in ('VERCEL_URL', 'VERCEL_BRANCH_URL', 'VERCEL_PROJECT_PRODUCTION_URL'):
    host = os.environ.get(env_key, '').strip()
    if host:
        CSRF_TRUSTED_ORIGINS.append(f'https://{host}')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'game',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'game.middleware.DisableCacheMiddleware',
]

ROOT_URLCONF = 'morskoy_boy.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'game.context_processors.static_version',
            ],
        },
    },
]

WSGI_APPLICATION = 'morskoy_boy.wsgi.application'

DB_PATH = os.environ.get('DATABASE_PATH')
if not DB_PATH:
    DB_PATH = '/tmp/db.sqlite3' if IS_VERCEL else str(BASE_DIR / 'db.sqlite3')

DATABASE_URL = get_database_url()

if DATABASE_URL:
    import dj_database_url

    DATABASES = {
        'default': dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=600,
            conn_health_checks=True,
        ),
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': DB_PATH,
        }
    }

if IS_VERCEL:
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True

AUTH_PASSWORD_VALIDATORS = []

LANGUAGE_CODE = 'ru'
TIME_ZONE = 'Europe/Moscow'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

if IS_VERCEL:
    STORAGES = {
        'default': {
            'BACKEND': 'django.core.files.storage.FileSystemStorage',
        },
        'staticfiles': {
            'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage',
        },
    }
    WHITENOISE_USE_FINDERS = True
    WHITENOISE_MAX_AGE = 31536000
else:
    STORAGES = {
        'default': {
            'BACKEND': 'django.core.files.storage.FileSystemStorage',
        },
        'staticfiles': {
            'BACKEND': 'whitenoise.storage.CompressedStaticFilesStorage',
        },
    }
    # Локально и на Vercel — из исходных папок app/static без collectstatic.
    WHITENOISE_USE_FINDERS = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
