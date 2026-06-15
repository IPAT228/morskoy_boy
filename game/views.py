import json
import random

from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.db.models import Avg, Count, Sum
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from .models import Question, GameSession

STRATEGY_LABELS = {
    'random': 'Случайный',
    'checkerboard': 'Шахматный',
    'hunter': 'Охотник',
    'probability': 'Решатель',
    'custom': 'Пользовательский',
}


def home(request):
    """Стартовая страница проекта"""
    try:
        return render(request, 'game/home.html')
    except Exception:
        messages.error(request, 'Не удалось открыть главную страницу.')
        return HttpResponse('Главная страница временно недоступна.', status=500)


def rules(request):
    """Страница с правилами игры"""
    try:
        return render(request, 'game/rules.html')
    except Exception:
        messages.error(request, 'Не удалось открыть страницу правил.')
        return redirect('game:home')


def learning(request):
    """Обучающий материал и выбор категории вопросов"""
    try:
        return render(request, 'game/learning.html')
    except Exception:
        messages.error(request, 'Не удалось открыть страницу выбора темы.')
        return redirect('game:home')


def index(request):
    """Главная страница — игра"""
    try:
        return render(request, 'game/index.html')
    except Exception:
        messages.error(request, 'Не удалось открыть игру.')
        return redirect('game:learning')


@require_POST
def register(request):
    """Регистрация игрока и переход к обучающему материалу"""
    try:
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '')
        password_confirm = request.POST.get('password_confirm', '')

        if not username or not password:
            messages.error(request, 'Введите имя пользователя и пароль.')
            return redirect('game:home')

        if len(username) < 3:
            messages.error(request, 'Имя пользователя должно содержать минимум 3 символа.')
            return redirect('game:home')

        if len(password) < 4:
            messages.error(request, 'Пароль должен содержать минимум 4 символа.')
            return redirect('game:home')

        if password != password_confirm:
            messages.error(request, 'Пароли не совпадают.')
            return redirect('game:home')

        if User.objects.filter(username=username).exists():
            messages.error(request, 'Пользователь с таким именем уже существует.')
            return redirect('game:home')

        user = User.objects.create_user(username=username, password=password)
        login(request, user)
        messages.success(
            request,
            f'Добро пожаловать, {username}! Выберите тему вопросов и изучите материал перед игрой.',
        )
        return redirect('game:learning')

    except IntegrityError:
        messages.error(request, 'Пользователь с таким именем уже существует.')
        return redirect('game:home')
    except Exception:
        messages.error(request, 'Не удалось зарегистрироваться. Попробуйте ещё раз.')
        return redirect('game:home')


@require_POST
def login_user(request):
    """Вход обычного пользователя"""
    try:
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '')

        if not username or not password:
            messages.error(request, 'Введите имя пользователя и пароль.')
            return redirect('game:home')

        user = authenticate(request, username=username, password=password)
        if user is None:
            messages.error(request, 'Неверное имя пользователя или пароль.')
            return redirect('game:home')

        login(request, user)
        messages.success(request, f'Вы вошли как {username}.')
        return redirect('game:home')

    except Exception:
        messages.error(request, 'Ошибка входа. Попробуйте ещё раз.')
        return redirect('game:home')


@require_POST
def logout_user(request):
    """Выход из текущей учетной записи"""
    logout(request)
    messages.success(request, 'Вы вышли из аккаунта.')
    return redirect('game:home')


def _build_player_stats(user):
    sessions = GameSession.objects.filter(user=user)
    total = sessions.count()
    empty = {
        'total_games': 0,
        'player_wins': 0,
        'ai_wins': 0,
        'win_rate': 0,
        'avg_player_shots': 0,
        'avg_player_hits': 0,
        'avg_player_accuracy': 0,
        'avg_ai_shots': 0,
        'avg_ai_hits': 0,
        'total_questions_answered': 0,
        'total_questions_correct': 0,
        'quiz_accuracy': 0,
        'strategy_breakdown': [],
        'recent_sessions': [],
    }
    if total == 0:
        return empty

    player_wins = sessions.filter(winner='player').count()
    ai_wins = sessions.filter(winner='ai').count()
    aggregates = sessions.aggregate(
        avg_player_shots=Avg('player_shots'),
        avg_player_hits=Avg('player_hits'),
        avg_ai_shots=Avg('ai_shots'),
        avg_ai_hits=Avg('ai_hits'),
        total_questions_answered=Sum('questions_answered'),
        total_questions_correct=Sum('questions_correct'),
    )

    total_shots = sessions.aggregate(total=Sum('player_shots'))['total'] or 0
    total_hits = sessions.aggregate(total=Sum('player_hits'))['total'] or 0
    avg_accuracy = round(total_hits / total_shots * 100, 1) if total_shots else 0

    answered = aggregates['total_questions_answered'] or 0
    correct = aggregates['total_questions_correct'] or 0
    quiz_accuracy = round(correct / answered * 100, 1) if answered else 0

    strategy_breakdown = []
    for row in sessions.values('ai_strategy').annotate(count=Count('id')).order_by('-count'):
        strategy = row['ai_strategy']
        strategy_breakdown.append({
            'strategy': strategy,
            'label': STRATEGY_LABELS.get(strategy, strategy),
            'count': row['count'],
            'wins': sessions.filter(ai_strategy=strategy, winner='player').count(),
        })

    recent_sessions = []
    for session in sessions.select_related('user')[:20]:
        recent_sessions.append({
            'id': session.pk,
            'date': session.started_at,
            'winner': session.winner,
            'winner_label': 'Победа' if session.winner == 'player' else 'Поражение',
            'ai_strategy': STRATEGY_LABELS.get(session.ai_strategy, session.ai_strategy),
            'question_category': session.question_category or '—',
            'player_shots': session.player_shots,
            'player_hits': session.player_hits,
            'player_accuracy': session.player_accuracy,
            'quiz_score': f'{session.questions_correct}/{session.questions_answered}',
            'quiz_accuracy': session.quiz_accuracy,
        })

    return {
        'total_games': total,
        'player_wins': player_wins,
        'ai_wins': ai_wins,
        'win_rate': round(player_wins / total * 100, 1) if total else 0,
        'avg_player_shots': round(aggregates['avg_player_shots'] or 0, 1),
        'avg_player_hits': round(aggregates['avg_player_hits'] or 0, 1),
        'avg_player_accuracy': avg_accuracy,
        'avg_ai_shots': round(aggregates['avg_ai_shots'] or 0, 1),
        'avg_ai_hits': round(aggregates['avg_ai_hits'] or 0, 1),
        'total_questions_answered': answered,
        'total_questions_correct': correct,
        'quiz_accuracy': quiz_accuracy,
        'strategy_breakdown': strategy_breakdown,
        'recent_sessions': recent_sessions,
    }


@login_required(login_url='game:home')
def player_stats(request):
    """Личная статистика залогиненного игрока"""
    try:
        stats = _build_player_stats(request.user)
    except Exception:
        messages.error(request, 'Не удалось загрузить статистику. Попробуйте позже.')
        return redirect('game:home')
    return render(request, 'game/stats.html', {
        'stats': stats,
        'strategy_labels': STRATEGY_LABELS,
    })


@require_GET
def api_questions(request):
    """Получить вопросы по фазе и/или сложности"""
    try:
        count = int(request.GET.get('count', 5))
        count = max(1, min(count, 100))
    except (TypeError, ValueError):
        return JsonResponse(
            {'status': 'error', 'message': 'Неверный параметр count.'},
            status=400,
        )

    try:
        phase = request.GET.get('phase', 'general')
        difficulty = request.GET.get('difficulty', '')
        category = request.GET.get('category', '').strip()

        qs = Question.objects.all()
        if phase and phase != 'all':
            qs = qs.filter(phase=phase)
        if difficulty:
            qs = qs.filter(difficulty=difficulty)
        if category and category != 'all':
            qs = qs.filter(category__name__iexact=category)

        questions = list(qs.values(
            'id', 'text', 'code_snippet',
            'option_a', 'option_b', 'option_c', 'option_d',
            'correct_answer', 'explanation', 'difficulty', 'phase',
            'category__name',
        ))
        random.shuffle(questions)
        return JsonResponse({'questions': questions[:count]})
    except Exception:
        return JsonResponse(
            {'status': 'error', 'message': 'Не удалось загрузить вопросы.'},
            status=500,
        )


@csrf_exempt
@require_POST
def api_save_session(request):
    """Сохранить результат игровой сессии"""
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse(
            {'status': 'error', 'message': 'Некорректные данные сессии.'},
            status=400,
        )

    try:
        session = GameSession.objects.create(
            user=request.user if request.user.is_authenticated else None,
            finished_at=timezone.now(),
            ai_strategy=data.get('ai_strategy', 'random'),
            question_category=data.get('question_category', ''),
            player_shots=int(data.get('player_shots', 0)),
            ai_shots=int(data.get('ai_shots', 0)),
            player_hits=int(data.get('player_hits', 0)),
            ai_hits=int(data.get('ai_hits', 0)),
            winner=data.get('winner', ''),
            questions_answered=int(data.get('questions_answered', 0)),
            questions_correct=int(data.get('questions_correct', 0)),
        )
        return JsonResponse({'status': 'ok', 'session_id': session.pk})
    except (TypeError, ValueError):
        return JsonResponse(
            {'status': 'error', 'message': 'Некорректные числовые значения сессии.'},
            status=400,
        )
    except Exception:
        return JsonResponse(
            {'status': 'error', 'message': 'Не удалось сохранить результат игры.'},
            status=500,
        )


@require_GET
def api_stats(request):
    """Статистика по сессиям (личная для авторизованных, общая для гостей)"""
    try:
        if request.user.is_authenticated:
            stats = _build_player_stats(request.user)
            return JsonResponse(stats)

        sessions = GameSession.objects.all()
        total = sessions.count()
        if total == 0:
            return JsonResponse({
                'total_games': 0,
                'player_wins': 0,
                'ai_wins': 0,
                'avg_player_shots': 0,
                'avg_questions_correct': 0,
            })

        player_wins = sessions.filter(winner='player').count()
        ai_wins = sessions.filter(winner='ai').count()
        avg_shots = sessions.aggregate(avg=Avg('player_shots'))['avg'] or 0
        avg_correct = sessions.aggregate(avg=Avg('questions_correct'))['avg'] or 0

        return JsonResponse({
            'total_games': total,
            'player_wins': player_wins,
            'ai_wins': ai_wins,
            'avg_player_shots': round(avg_shots, 1),
            'avg_questions_correct': round(avg_correct, 1),
        })
    except Exception:
        return JsonResponse(
            {'status': 'error', 'message': 'Не удалось загрузить статистику.'},
            status=500,
        )
