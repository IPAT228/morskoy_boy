from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models


class QuestionCategory(models.Model):
    """Категория вопроса (массивы, циклы, условия и т.д.)"""
    name = models.CharField('Название категории', max_length=100)
    description = models.TextField('Описание', blank=True)

    class Meta:
        verbose_name = 'Категория вопроса'
        verbose_name_plural = 'Категории вопросов'

    def __str__(self):
        return self.name or 'Без названия'

    def clean(self):
        super().clean()
        if not (self.name or '').strip():
            raise ValidationError({'name': 'Название категории не может быть пустым.'})


class Question(models.Model):
    """Вопрос мини-экзамена"""
    DIFFICULTY_CHOICES = [
        ('easy', 'Лёгкий'),
        ('medium', 'Средний'),
        ('hard', 'Сложный'),
    ]
    PHASE_CHOICES = [
        ('placement', 'Расстановка кораблей'),
        ('battle', 'Процесс боя'),
        ('strategy', 'Смена стратегии'),
        ('postmortem', 'Финал и анализ'),
        ('general', 'Общий'),
    ]

    category = models.ForeignKey(
        QuestionCategory,
        on_delete=models.CASCADE,
        related_name='questions',
        verbose_name='Категория',
    )
    phase = models.CharField(
        'Фаза игры',
        max_length=20,
        choices=PHASE_CHOICES,
        default='general',
    )
    difficulty = models.CharField(
        'Сложность',
        max_length=10,
        choices=DIFFICULTY_CHOICES,
        default='easy',
    )
    text = models.TextField('Текст вопроса')
    code_snippet = models.TextField('Фрагмент кода', blank=True)
    option_a = models.CharField('Вариант A', max_length=500)
    option_b = models.CharField('Вариант B', max_length=500)
    option_c = models.CharField('Вариант C', max_length=500)
    option_d = models.CharField('Вариант D', max_length=500)
    correct_answer = models.CharField(
        'Правильный ответ',
        max_length=1,
        choices=[('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D')],
    )
    explanation = models.TextField('Объяснение правильного ответа')

    class Meta:
        verbose_name = 'Вопрос'
        verbose_name_plural = 'Вопросы'

    def __str__(self):
        preview = (self.text or '')[:60]
        if len(self.text or '') > 60:
            preview += '…'
        return f'[{self.get_difficulty_display()}] {preview or "Без текста"}'

    def clean(self):
        super().clean()
        for field_name, label in (
            ('text', 'Текст вопроса'),
            ('option_a', 'Вариант A'),
            ('option_b', 'Вариант B'),
            ('option_c', 'Вариант C'),
            ('option_d', 'Вариант D'),
            ('explanation', 'Объяснение'),
        ):
            if not (getattr(self, field_name, '') or '').strip():
                raise ValidationError({field_name: f'Поле «{label}» не может быть пустым.'})
        if self.correct_answer not in ('A', 'B', 'C', 'D'):
            raise ValidationError({'correct_answer': 'Правильный ответ должен быть A, B, C или D.'})


class GameSession(models.Model):
    """Запись об игровой сессии"""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='game_sessions',
        null=True,
        blank=True,
        verbose_name='Игрок',
    )
    started_at = models.DateTimeField('Начало', auto_now_add=True)
    finished_at = models.DateTimeField('Окончание', null=True, blank=True)
    ai_strategy = models.CharField('Стратегия ИИ', max_length=30, default='random')
    question_category = models.CharField('Категория вопросов', max_length=100, blank=True)
    player_shots = models.IntegerField('Выстрелов игрока', default=0)
    ai_shots = models.IntegerField('Выстрелов ИИ', default=0)
    player_hits = models.IntegerField('Попаданий игрока', default=0)
    ai_hits = models.IntegerField('Попаданий ИИ', default=0)
    winner = models.CharField(
        'Победитель',
        max_length=10,
        choices=[('player', 'Игрок'), ('ai', 'Компьютер')],
        blank=True,
    )
    questions_answered = models.IntegerField('Вопросов отвечено', default=0)
    questions_correct = models.IntegerField('Правильных ответов', default=0)

    class Meta:
        verbose_name = 'Игровая сессия'
        verbose_name_plural = 'Игровые сессии'
        ordering = ['-started_at']

    def __str__(self):
        owner = self.user.username if self.user_id else 'Гость'
        return f'Сессия #{self.pk} — {owner} ({self.started_at:%d.%m.%Y %H:%M})'

    @property
    def player_accuracy(self):
        if not self.player_shots:
            return 0
        return round(self.player_hits / self.player_shots * 100)

    @property
    def quiz_accuracy(self):
        if not self.questions_answered:
            return 0
        return round(self.questions_correct / self.questions_answered * 100)

    def clean(self):
        super().clean()
        for field_name in ('player_shots', 'ai_shots', 'player_hits', 'ai_hits',
                           'questions_answered', 'questions_correct'):
            value = getattr(self, field_name, 0)
            if value is not None and value < 0:
                raise ValidationError({field_name: 'Значение не может быть отрицательным.'})
        if self.questions_correct > self.questions_answered:
            raise ValidationError({
                'questions_correct': 'Число правильных ответов не может превышать число отвеченных вопросов.',
            })
        if self.winner and self.winner not in ('player', 'ai'):
            raise ValidationError({'winner': 'Победитель должен быть «player» или «ai».'})
