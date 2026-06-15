"""Initialize SQLite database on Vercel serverless (/tmp is writable)."""
from __future__ import annotations

import os
from pathlib import Path


def ensure_vercel_database() -> None:
    if os.environ.get('VERCEL') != '1':
        return

    db_path = Path(os.environ.get('DATABASE_PATH', '/tmp/db.sqlite3'))
    if db_path.exists():
        return

    import django

    django.setup()

    from django.core.management import call_command

    call_command('migrate', verbosity=0, interactive=False)
    call_command('populate_questions', verbosity=0)

    from django.contrib.auth import get_user_model

    User = get_user_model()
    admin_user, _ = User.objects.get_or_create(
        username='admin',
        defaults={
            'email': 'admin@example.com',
            'is_staff': True,
            'is_superuser': True,
        },
    )
    admin_user.is_staff = True
    admin_user.is_superuser = True
    admin_user.set_password('admin')
    admin_user.save(update_fields=['password', 'is_staff', 'is_superuser'])
