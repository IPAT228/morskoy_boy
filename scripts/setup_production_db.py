#!/usr/bin/env python
"""Подготовка облачной PostgreSQL: migrate, вопросы, проверка admin."""
from __future__ import annotations

import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'morskoy_boy.settings')

try:
    from dotenv import load_dotenv
except ImportError:
    load_dotenv = None


def main() -> int:
    env_path = ROOT / '.env'
    if load_dotenv and env_path.exists():
        load_dotenv(env_path)

    from morskoy_boy.database import get_database_url, get_migrate_database_url

    migrate_url = get_migrate_database_url()
    if not migrate_url:
        print('Ошибка: не найден DATABASE_URL.')
        print('1. Создайте БД на https://neon.tech (бесплатно).')
        print('2. Скопируйте Connection string → PostgreSQL.')
        print('3. Вставьте в .env: DATABASE_URL=postgresql://...')
        print('4. Тот же DATABASE_URL добавьте в Vercel → Environment Variables.')
        return 1

    os.environ['DATABASE_URL'] = migrate_url

    import django

    django.setup()

    from django.contrib.auth import get_user_model
    from django.core.management import call_command

    from game.models import Question

    print('Подключение:', migrate_url.split('@')[-1])

    call_command('migrate', interactive=False)
    print('Миграции применены.')

    call_command('populate_questions')
    print(f'Вопросов в базе: {Question.objects.count()}')

    User = get_user_model()
    admin_username = os.environ.get('ADMIN_USERNAME', 'admin')
    admin_password = os.environ.get('ADMIN_PASSWORD', 'admin')
    admin_user, created = User.objects.get_or_create(
        username=admin_username,
        defaults={'is_staff': True, 'is_superuser': True},
    )
    if created:
        admin_user.set_password(admin_password)
        admin_user.save()
        print(f'Создан администратор: {admin_username}')
    else:
        print(f'Администратор «{admin_username}» уже существует.')

    print(f'Пользователей в базе: {User.objects.count()}')
    print('Готово. Добавьте DATABASE_URL в Vercel и сделайте Redeploy.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
