import time

from django.conf import settings


def static_version(request):
    """Force fresh CSS/JS while developing the project."""
    if settings.DEBUG:
        return {'STATIC_VERSION': str(int(time.time()))}
    import os
    return {
        'STATIC_VERSION': os.environ.get('VERCEL_GIT_COMMIT_SHA', 'learning-v2')[:12],
    }
