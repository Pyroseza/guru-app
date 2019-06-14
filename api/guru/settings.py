"""
Django settings for guru project.

Generated by 'django-admin startproject' using Django 2.1.3.

For more information on this file, see
https://docs.djangoproject.com/en/2.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.1/ref/settings/
"""

import os
import environ


root = environ.Path(__file__) - 2
env = environ.Env(DEBUG=(bool, False),)

DEPLOYMENT_ENVIRONMENT = os.environ.get('DEPLOYMENT_ENVIRONMENT')
if DEPLOYMENT_ENVIRONMENT == 'docker':
    env.read_env('/run/secrets/api-secrets')
else:
    env.read_env('guru/.env.example')

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY')
DEBUG = env('DEBUG')
HTTPS = env.bool('HTTPS', False)
if HTTPS:
    PROTOCOL = 'https'
else:
    PROTOCOL = 'http'
SITE_ID = 1
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS')


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'django_q',
    'rest_framework',
    'corsheaders',
    'haystack',
    'fieldsignals',
    'phonenumber_field',
    'profiles',
    'tickets',
    'notification',
    'info',
    'billing',
    'oxd',
    'suitecrm'
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'guru.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [str(root.path('templates'))],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'guru.wsgi.application'
FIXTURE_DIRS = [str(root.path('fixtures'))]

# Database
# https://docs.djangoproject.com/en/2.1/ref/settings/#databases

if env.str('DATABASE_URL', default=''):
    DATABASES = {
        'default': env.db(),
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': root('db.sqlite3'),
        },
    }


# Password validation
# https://docs.djangoproject.com/en/2.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': (
            'django.contrib.auth.password_validation.'
            'UserAttributeSimilarityValidator'
        ),
    },
    {
        'NAME': (
            'django.contrib.auth.password_validation.'
            'MinimumLengthValidator'
        ),
    },
    {
        'NAME': (
            'django.contrib.auth.password_validation.'
            'CommonPasswordValidator'
        ),
    },
    {
        'NAME': (
            'django.contrib.auth.password_validation'
            '.NumericPasswordValidator'
        ),
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.1/howto/static-files/

STATIC_ROOT = 'staticfiles'
STATIC_URL = '/api-static/'

STATICFILES_DIRS = (
    str(root.path('assets')),
)

MEDIA_ROOT = 'api-media/'
MEDIA_URL = '/api-media/'

AUTH_USER_MODEL = 'profiles.User'

AUTHENTICATION_BACKENDS = [
    'oxd.authentication.OpenIdBackend',
    'django.contrib.auth.backends.ModelBackend'
]

REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': (
        'djangorestframework_camel_case.render.CamelCaseJSONRenderer',
    ),
    'DEFAULT_PARSER_CLASSES': (
        'djangorestframework_camel_case.parser.CamelCaseJSONParser',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'profiles.backends.JWTAuthentication',
    ),
    'DEFAULT_PAGINATION_CLASS': (
        'rest_framework.pagination'
        '.PageNumberPagination'
    ),
    'PAGE_SIZE': 10,
}

# Q CLUSTER SETTINGS
Q_CLUSTER = {
    'name': 'guru',
    'workers': 8,
    'recycle': 500,
    'timeout': 600,
    'compress': True,
    'save_limit': 250,
    'queue_limit': 500,
    'cpu_affinity': 1,
    'label': 'Guru Q-Cluster',
    'orm': 'default'
}

CORS_ORIGIN_WHITELIST = env.list('CORS_ORIGIN_WHITELIST', [])

if DEBUG:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
else:
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'


DEFAULT_FROM_EMAIL = env.str('EMAIL_FROM')
EMAIL_FROM = env.str('EMAIL_FROM')
TEST_TEXT_EMAIL = env.bool('TEST_TEXT_EMAIL', False)
LIVE_TEST_EMAIL = env.bool('LIVE_TEST_EMAIL', False)
TEST_EMAIL_RECIPIENTS = env.list('TEST_EMAIL_RECIPIENTS')

EMAIL_USE_TLS = bool(int(os.environ.get('EMAIL_USE_TLS', '1')))
EMAIL_HOST = os.environ.get('EMAIL_HOST')
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', '587'))

NOTIFICATIONS_RECIPIENT = env('NOTIFICATIONS_RECIPIENT')

TWILIO_ACCOUNT_SID = env.str('TWILIO_ACCOUNT_SID', '')
TWILIO_AUTH_TOKEN = env.str('TWILIO_AUTH_TOKEN', '')
FRONTEND_URL = env.str('FRONTEND_URL', 'https://guru.gluu.org')
GLUU_USER_APP = env.str('GLUU_USER_APP', 'https://users.gluu.org')

HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'haystack.backends.whoosh_backend.WhooshEngine',
        'PATH': str(root.path('whoosh_index'))
    },
}

HEX_KEY = env.str('HEX_KEY')
