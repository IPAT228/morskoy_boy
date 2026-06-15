import json
import random

from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from .models import Question, GameSession


def home(request):
    """Стартовая страница проекта"""
    return render(request, 'game/home.html')


@require_POST
def register(request):
    """Регистрация игрока и вход в игру"""
    username = request.POST.get('username', '').strip()
    password = request.POST.get('password', '')
    password_confirm = request.POST.get('password_confirm', '')

    if not username or not password:
        messages.error(request, 'Введите имя пользователя и пароль.')
        return redirect('game:home')

    if password != password_confirm:
        messages.error(request, 'Пароли не совпадают.')
        return redirect('game:home')

    if User.objects.filter(username=username).exists():
        messages.error(request, 'Пользователь с таким именем уже существует.')
        return redirect('game:home')

    user = User.objects.create_user(username=username, password=password)
    login(request, user)
    messages.success(request, f'Добро пожаловать, {username}!')
    return redirect('game:index')


@require_POST
def login_user(request):
    """Вход обычного пользователя"""
    username = request.POST.get('username', '').strip()
    password = request.POST.get('password', '')

    user = authenticate(request, username=username, password=password)
    if user is None:
        messages.error(request, 'Неверное имя пользователя или пароль.')
        return redirect('game:home')

    login(request, user)
    messages.success(request, f'Вы вошли как {username}.')
    return redirect('game:home')


@require_POST
def logout_user(request):
    """Выход из текущей учетной записи"""
    logout(request)
    messages.success(request, 'Вы вышли из аккаунта.')
    return redirect('game:home')


def rules(request):
    """Страница с правилами игры"""
    return render(request, 'game/rules.html')


def learning(request):
    """Обучающий материал и выбор категории вопросов"""
    return render(request, 'game/learning.html')


def index(request):
    """Главная страница — игра"""
    return render(request, 'game/index.html')


@require_GET
def api_questions(request):
    """Получить вопросы по фазе и/или сложности"""
    phase = request.GET.get('phase', 'general')
    difficulty = request.GET.get('difficulty', '')
    category = request.GET.get('category', '').strip()
    count = int(request.GET.get('count', 5))

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


@csrf_exempt
@require_POST
def api_save_session(request):
    """Сохранить результат игровой сессии"""
    try:
        data = json.loads(request.body)
        session = GameSession.objects.create(
            ai_strategy=data.get('ai_strategy', 'random'),
            player_shots=data.get('player_shots', 0),
            ai_shots=data.get('ai_shots', 0),
            player_hits=data.get('player_hits', 0),
            ai_hits=data.get('ai_hits', 0),
            winner=data.get('winner', ''),
            questions_answered=data.get('questions_answered', 0),
            questions_correct=data.get('questions_correct', 0),
        )
        return JsonResponse({'status': 'ok', 'session_id': session.pk})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)


@require_GET
def api_stats(request):
    """Статистика по всем сессиям"""
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

    from django.db.models import Avg
    avg_shots = sessions.aggregate(avg=Avg('player_shots'))['avg'] or 0
    avg_correct = sessions.aggregate(avg=Avg('questions_correct'))['avg'] or 0

    return JsonResponse({
        'total_games': total,
        'player_wins': player_wins,
        'ai_wins': ai_wins,
        'avg_player_shots': round(avg_shots, 1),
        'avg_questions_correct': round(avg_correct, 1),
    })
