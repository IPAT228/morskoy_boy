"""Initialize database on Vercel serverless."""
from __future__ import annotations

import logging
import os
from pathlib import Path

from morskoy_boy.database import get_migrate_database_url, uses_postgres

logger = logging.getLogger(__name__)


def ensure_vercel_database() -> None:
    if os.environ.get('VERCEL') != '1':
        return

    if not uses_postgres():
        db_path = Path(os.environ.get('DATABASE_PATH', '/tmp/db.sqlite3'))
        if db_path.exists():
            return

    migrate_url = get_migrate_database_url()
    if migrate_url:
        os.environ['DATABASE_URL'] = migrate_url

    try:
        import django

        django.setup()

        from django.core.management import call_command
        from django.contrib.auth import get_user_model

        from game.models import Question

        call_command('migrate', verbosity=0, interactive=False)

        if Question.objects.count() < 100:
            call_command('populate_questions', verbosity=0)

        User = get_user_model()
        admin_username = os.environ.get('ADMIN_USERNAME', 'admin').strip() or 'admin'
        admin_password = os.environ.get('ADMIN_PASSWORD', 'admin')

        admin_user, created = User.objects.get_or_create(
            username=admin_username,
            defaults={
                'email': os.environ.get('ADMIN_EMAIL', 'admin@example.com'),
                'is_staff': True,
                'is_superuser': True,
            },
        )
        if created:
            admin_user.set_password(admin_password)
            admin_user.is_staff = True
            admin_user.is_superuser = True
            admin_user.save(update_fields=['password', 'is_staff', 'is_superuser'])
        elif not admin_user.is_superuser:
            admin_user.is_staff = True
            admin_user.is_superuser = True
            admin_user.save(update_fields=['is_staff', 'is_superuser'])

    except Exception:
        logger.exception('Vercel database initialization failed')
