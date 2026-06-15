# -*- coding: utf-8 -*-
"""Проверка банка вопросов на корректность."""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from game.question_bank import ALL_QUESTIONS, CATEGORY_NAMES  # noqa: E402

SPOILER_PATTERNS = [
    re.compile(r'#\s*0\s*[–-]\s*пуст', re.I),
    re.compile(r'#\s*1\s*[–-]\s*кораб', re.I),
    re.compile(r'#\s*2\s*[–-]\s*промах', re.I),
    re.compile(r'#\s*3\s*[–-]\s*попад', re.I),
    re.compile(r'0-пусто,1-корабль', re.I),
    re.compile(r'elif cell == 2:\s*miss', re.I),
]

VALID_ANSWERS = {'A', 'B', 'C', 'D'}
errors = []
warnings = []

if len(ALL_QUESTIONS) != 125:
    errors.append(f'Ожидалось 125 вопросов, найдено {len(ALL_QUESTIONS)}')

for cat in CATEGORY_NAMES:
    count = sum(1 for q in ALL_QUESTIONS if q['category'] == cat)
    if count != 25:
        errors.append(f'Категория «{cat}»: {count} вопросов вместо 25')

for i, q in enumerate(ALL_QUESTIONS, 1):
    prefix = f'#{i} [{q["category"]}] {q["text"][:50]}…'
    if q['correct_answer'] not in VALID_ANSWERS:
        errors.append(f'{prefix}: неверный correct_answer={q["correct_answer"]!r}')
    for key in ('option_a', 'option_b', 'option_c', 'option_d'):
        if not q.get(key, '').strip():
            errors.append(f'{prefix}: пустой {key}')
    correct_key = 'option_' + q['correct_answer'].lower()
    if q[correct_key].strip() == '':
        errors.append(f'{prefix}: правильный вариант пустой')
    code = q.get('code_snippet', '')
    for pat in SPOILER_PATTERNS:
        if pat.search(code):
            warnings.append(f'{prefix}: фрагмент кода раскрывает ответ: {pat.pattern}')

if errors:
    print('ОШИБКИ:')
    for e in errors:
        print(' -', e)
if warnings:
    print('ПРЕДУПРЕЖДЕНИЯ:')
    for w in warnings:
        print(' -', w)
if not errors and not warnings:
    print('OK: все 125 вопросов прошли проверку.')
sys.exit(1 if errors else 0)
