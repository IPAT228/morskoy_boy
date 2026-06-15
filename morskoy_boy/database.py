"""Resolve database URL from common hosting env vars."""
from __future__ import annotations

import os


def _first_env(*keys: str) -> str:
    for key in keys:
        value = os.environ.get(key, '').strip()
        if value:
            return value
    return ''


def get_database_url() -> str:
    """Runtime connection string (pooler URL is OK)."""
    return _first_env(
        'DATABASE_URL',
        'POSTGRES_URL',
        'NEON_DATABASE_URL',
        'POSTGRES_PRISMA_URL',
    )


def get_migrate_database_url() -> str:
    """Direct connection for migrations (prefer non-pooling URL)."""
    return _first_env(
        'DATABASE_URL',
        'POSTGRES_URL_NON_POOLING',
        'POSTGRES_URL',
        'NEON_DATABASE_URL',
    )


def uses_postgres() -> bool:
    return bool(get_database_url())
