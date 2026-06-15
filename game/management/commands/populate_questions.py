from django.core.management.base import BaseCommand

from game.models import QuestionCategory, Question
from game.question_bank import ALL_QUESTIONS, CATEGORY_NAMES


class Command(BaseCommand):
    help = 'Заполняет банк вопросов для игры (25 на каждую категорию)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Удалить все вопросы перед заполнением',
        )

    def handle(self, *args, **options):
        categories = {}
        for name in CATEGORY_NAMES:
            cat, _ = QuestionCategory.objects.get_or_create(
                name=name,
                defaults={'description': f'Вопросы по теме «{name}»'},
            )
            categories[name] = cat

        if options['reset']:
            deleted, _ = Question.objects.all().delete()
            self.stdout.write(f'Удалено вопросов: {deleted}')

        created = 0
        for item in ALL_QUESTIONS:
            data = {**item, 'category': categories[item['category']]}
            _, was_created = Question.objects.get_or_create(
                text=data['text'],
                defaults=data,
            )
            if was_created:
                created += 1

        total = Question.objects.count()
        self.stdout.write(self.style.SUCCESS(
            f'Создано новых: {created}. Всего в базе: {total} (ожидается {len(ALL_QUESTIONS)}).'
        ))
        for name in CATEGORY_NAMES:
            count = Question.objects.filter(category=categories[name]).count()
            self.stdout.write(f'  {name}: {count}')
