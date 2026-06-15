from django.contrib import admin
from .models import QuestionCategory, Question, GameSession


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 0


@admin.register(QuestionCategory)
class QuestionCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    inlines = [QuestionInline]


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('text', 'category', 'phase', 'difficulty', 'correct_answer')
    list_filter = ('category', 'phase', 'difficulty')
    search_fields = ('text',)


@admin.register(GameSession)
class GameSessionAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'started_at', 'ai_strategy', 'winner',
        'player_shots', 'player_hits', 'questions_correct',
    )
    list_filter = ('winner', 'ai_strategy')
