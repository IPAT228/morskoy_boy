from django.conf import settings
from django.db import models


class QuestionCategory(models.Model):
    """Категория вопроса (массивы, циклы, условия и т.д.)"""
    name = models.CharField('Название категории', max_length=100)
    description = models.TextField('Описание', blank=True)

    class Meta:
        verbose_name = 'Категория вопроса'
        verbose_name_plural = 'Категории вопросов'

    def __str__(self):
        return self.name


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
        return f'[{self.get_difficulty_display()}] {self.text[:60]}...'


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
