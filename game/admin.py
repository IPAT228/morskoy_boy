from django.contrib import admin, messages
from django.core.exceptions import ValidationError
from django.db import IntegrityError

from .forms import GameSessionAdminForm, QuestionAdminForm, QuestionCategoryAdminForm
from .models import QuestionCategory, Question, GameSession


class SafeModelAdminMixin:
    """Примитивная обработка ошибок при сохранении и удалении в админке."""

    def save_model(self, request, obj, form, change):
        try:
            super().save_model(request, obj, form, change)
        except ValidationError as exc:
            self.message_user(
                request,
                '; '.join(exc.messages) if hasattr(exc, 'messages') else str(exc),
                level=messages.ERROR,
            )
            raise
        except IntegrityError:
            self.message_user(
                request,
                'Не удалось сохранить: запись с такими данными уже существует или нарушена связь.',
                level=messages.ERROR,
            )
            raise
        except Exception:
            self.message_user(
                request,
                'Не удалось сохранить запись. Проверьте корректность данных.',
                level=messages.ERROR,
            )
            raise

    def delete_model(self, request, obj):
        try:
            super().delete_model(request, obj)
        except Exception:
            self.message_user(
                request,
                'Не удалось удалить запись. Возможно, она связана с другими данными.',
                level=messages.ERROR,
            )
            raise

    def delete_queryset(self, request, queryset):
        try:
            super().delete_queryset(request, queryset)
        except Exception:
            self.message_user(
                request,
                'Не удалось удалить выбранные записи.',
                level=messages.ERROR,
            )
            raise


class QuestionInline(admin.TabularInline):
    model = Question
    form = QuestionAdminForm
    extra = 0


@admin.register(QuestionCategory)
class QuestionCategoryAdmin(SafeModelAdminMixin, admin.ModelAdmin):
    form = QuestionCategoryAdminForm
    list_display = ('name', 'description')
    search_fields = ('name',)
    inlines = [QuestionInline]


@admin.register(Question)
class QuestionAdmin(SafeModelAdminMixin, admin.ModelAdmin):
    form = QuestionAdminForm
    list_display = ('text_short', 'category', 'phase', 'difficulty', 'correct_answer')
    list_filter = ('category', 'phase', 'difficulty')
    search_fields = ('text', 'option_a', 'option_b', 'option_c', 'option_d')
    list_select_related = ('category',)

    @admin.display(description='Текст вопроса')
    def text_short(self, obj):
        if not obj.text:
            return '—'
        return obj.text[:80] + ('…' if len(obj.text) > 80 else '')


@admin.register(GameSession)
class GameSessionAdmin(SafeModelAdminMixin, admin.ModelAdmin):
    form = GameSessionAdminForm
    list_display = (
        'id', 'user', 'started_at', 'ai_strategy', 'question_category',
        'winner', 'player_shots', 'player_hits', 'questions_correct',
    )
    list_filter = ('winner', 'ai_strategy', 'user', 'question_category')
    search_fields = ('user__username', 'question_category')
    readonly_fields = (
        'started_at', 'player_accuracy_display', 'quiz_accuracy_display',
    )
    list_select_related = ('user',)

    @admin.display(description='Точность игрока, %')
    def player_accuracy_display(self, obj):
        try:
            return obj.player_accuracy
        except Exception:
            return '—'

    @admin.display(description='Точность ответов, %')
    def quiz_accuracy_display(self, obj):
        try:
            return obj.quiz_accuracy
        except Exception:
            return '—'
