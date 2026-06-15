import time

from django.conf import settings


def static_version(request):
    """Force fresh CSS/JS while developing the project."""
    if settings.DEBUG:
        return {'STATIC_VERSION': str(int(time.time()))}
    return {'STATIC_VERSION': '1'}
