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
