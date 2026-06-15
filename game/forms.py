from django import forms
from django.core.exceptions import ValidationError

from .models import Question, QuestionCategory, GameSession


class QuestionAdminForm(forms.ModelForm):
    class Meta:
        model = Question
        fields = '__all__'

    def clean(self):
        cleaned_data = super().clean()
        if self.errors:
            return cleaned_data

        for field_name, label in (
            ('text', 'Текст вопроса'),
            ('option_a', 'Вариант A'),
            ('option_b', 'Вариант B'),
            ('option_c', 'Вариант C'),
            ('option_d', 'Вариант D'),
            ('explanation', 'Объяснение'),
        ):
            value = (cleaned_data.get(field_name) or '').strip()
            if not value:
                raise ValidationError(f'Поле «{label}» не может быть пустым.')

        correct = cleaned_data.get('correct_answer')
        if correct not in ('A', 'B', 'C', 'D'):
            raise ValidationError('Правильный ответ должен быть A, B, C или D.')

        return cleaned_data


class QuestionCategoryAdminForm(forms.ModelForm):
    class Meta:
        model = QuestionCategory
        fields = '__all__'

    def clean_name(self):
        name = (self.cleaned_data.get('name') or '').strip()
        if not name:
            raise ValidationError('Название категории не может быть пустым.')
        if len(name) > 100:
            raise ValidationError('Название категории слишком длинное (максимум 100 символов).')
        return name


class GameSessionAdminForm(forms.ModelForm):
    class Meta:
        model = GameSession
        fields = '__all__'

    def clean(self):
        cleaned_data = super().clean()
        if self.errors:
            return cleaned_data

        for field_name in ('player_shots', 'ai_shots', 'player_hits', 'ai_hits',
                           'questions_answered', 'questions_correct'):
            value = cleaned_data.get(field_name)
            if value is not None and value < 0:
                raise ValidationError(f'Поле «{field_name}» не может быть отрицательным.')

        answered = cleaned_data.get('questions_answered') or 0
        correct = cleaned_data.get('questions_correct') or 0
        if correct > answered:
            raise ValidationError('Число правильных ответов не может быть больше числа отвеченных вопросов.')

        winner = cleaned_data.get('winner')
        if winner and winner not in ('player', 'ai'):
            raise ValidationError('Победитель должен быть «player» или «ai».')

        return cleaned_data
