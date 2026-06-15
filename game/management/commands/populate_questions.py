from django.core.management.base import BaseCommand
from game.models import QuestionCategory, Question


class Command(BaseCommand):
    help = 'Заполняет банк вопросов для игры'

    def handle(self, *args, **options):
        # Категории
        cat_arrays, _ = QuestionCategory.objects.get_or_create(
            name='Массивы', defaults={'description': 'Работа с массивами и списками в Python'})
        cat_loops, _ = QuestionCategory.objects.get_or_create(
            name='Циклы', defaults={'description': 'Циклы for и while в Python'})
        cat_cond, _ = QuestionCategory.objects.get_or_create(
            name='Условия', defaults={'description': 'Условные операторы if/elif/else'})
        cat_func, _ = QuestionCategory.objects.get_or_create(
            name='Функции', defaults={'description': 'Определение и вызов функций'})
        cat_algo, _ = QuestionCategory.objects.get_or_create(
            name='Алгоритмы', defaults={'description': 'Основы алгоритмизации'})

        questions_data = [
            # === GENERAL / BATTLE ===
            {
                'category': cat_arrays, 'phase': 'general', 'difficulty': 'easy',
                'text': 'Как обратиться к элементу массива board в строке 3 и столбце 5?',
                'code_snippet': 'board = [[0]*10 for _ in range(10)]',
                'option_a': 'board[3][5]', 'option_b': 'board[5][3]',
                'option_c': 'board(3, 5)', 'option_d': 'board{3}{5}',
                'correct_answer': 'A',
                'explanation': 'В Python к элементу двумерного списка обращаются через board[строка][столбец].',
            },
            {
                'category': cat_arrays, 'phase': 'general', 'difficulty': 'easy',
                'text': 'Какой результат даст len(board), если board — это список 10×10?',
                'code_snippet': 'board = [[0]*10 for _ in range(10)]',
                'option_a': '100', 'option_b': '10',
                'option_c': '20', 'option_d': 'Ошибка',
                'correct_answer': 'B',
                'explanation': 'len(board) возвращает количество строк (внешних списков), т.е. 10.',
            },
            {
                'category': cat_arrays, 'phase': 'battle', 'difficulty': 'easy',
                'text': 'Что означает значение 0 в матрице игрового поля?',
                'code_snippet': '# 0 – пусто, 1 – корабль, 2 – промах, 3 – попадание',
                'option_a': 'Попадание', 'option_b': 'Корабль',
                'option_c': 'Пустая клетка', 'option_d': 'Промах',
                'correct_answer': 'C',
                'explanation': 'В нашей кодировке 0 означает пустую (неисследованную) клетку.',
            },
            {
                'category': cat_arrays, 'phase': 'battle', 'difficulty': 'medium',
                'text': 'Как заполнить всю строку row=2 нулями?',
                'code_snippet': 'board = [[1]*10 for _ in range(10)]',
                'option_a': 'board[2] = [0]*10', 'option_b': 'board[2] = 0',
                'option_c': 'board[:][2] = 0', 'option_d': 'board[2].clear()',
                'correct_answer': 'A',
                'explanation': 'board[2] = [0]*10 заменяет всю строку новым списком из десяти нулей.',
            },
            {
                'category': cat_loops, 'phase': 'general', 'difficulty': 'easy',
                'text': 'Сколько раз выполнится тело цикла?',
                'code_snippet': 'for i in range(10):\n    print(i)',
                'option_a': '9', 'option_b': '10',
                'option_c': '11', 'option_d': '1',
                'correct_answer': 'B',
                'explanation': 'range(10) генерирует числа от 0 до 9, то есть 10 итераций.',
            },
            {
                'category': cat_loops, 'phase': 'general', 'difficulty': 'medium',
                'text': 'Какой цикл перебирает ВСЕ клетки поля 10×10?',
                'code_snippet': '',
                'option_a': 'for i in range(10): for j in range(10):',
                'option_b': 'for i in range(100):',
                'option_c': 'while i < 10 and j < 10:',
                'option_d': 'for i, j in range(10, 10):',
                'correct_answer': 'A',
                'explanation': 'Вложенный цикл for i ... for j перебирает все 100 клеток поля.',
            },
            {
                'category': cat_cond, 'phase': 'battle', 'difficulty': 'easy',
                'text': 'Какое условие проверяет попадание по кораблю?',
                'code_snippet': '',
                'option_a': 'if board[r][c] == 0:', 'option_b': 'if board[r][c] == 1:',
                'option_c': 'if board[r][c] == 2:', 'option_d': 'if board[r][c] != 0:',
                'correct_answer': 'B',
                'explanation': 'Значение 1 в матрице означает корабль, значит board[r][c] == 1 — попадание.',
            },
            {
                'category': cat_cond, 'phase': 'battle', 'difficulty': 'medium',
                'text': 'Что делает этот код при выстреле?',
                'code_snippet': 'if board[r][c] == 1:\n    board[r][c] = 3\nelse:\n    board[r][c] = 2',
                'option_a': 'Ставит корабль или удаляет', 'option_b': 'Проверяет попадание и помечает клетку',
                'option_c': 'Считает количество кораблей', 'option_d': 'Перемещает корабль',
                'correct_answer': 'B',
                'explanation': 'Если в клетке корабль (1) — помечает попадание (3), иначе — промах (2).',
            },
            # === PLACEMENT ===
            {
                'category': cat_func, 'phase': 'placement', 'difficulty': 'medium',
                'text': 'Какой цикл лучше использовать для расстановки 4-палубного корабля горизонтально?',
                'code_snippet': 'def place_ship(board, row, col, size):\n    # ???',
                'option_a': 'for i in range(size): board[row][col+i] = 1',
                'option_b': 'for i in range(size): board[row+i][col+i] = 1',
                'option_c': 'board[row][col:col+size] = size', 'option_d': 'while size > 0: board[row][col] = 1',
                'correct_answer': 'A',
                'explanation': 'Горизонтальный корабль занимает клетки (row, col), (row, col+1), ..., (row, col+size-1).',
            },
            {
                'category': cat_func, 'phase': 'placement', 'difficulty': 'hard',
                'text': 'Что проверяет функция can_place перед установкой корабля?',
                'code_snippet': 'def can_place(board, row, col, size, vertical):\n    for i in range(size):\n        r = row + (i if vertical else 0)\n        c = col + (0 if vertical else i)\n        if r >= 10 or c >= 10:\n            return False\n        if board[r][c] != 0:\n            return False\n    return True',
                'option_a': 'Что корабль не выходит за поле и не накладывается на другие',
                'option_b': 'Что корабль стоит только вертикально',
                'option_c': 'Что корабль касается другого корабля',
                'option_d': 'Что все клетки заняты',
                'correct_answer': 'A',
                'explanation': 'Функция проверяет границы поля (r>=10, c>=10) и пустоту клеток (board[r][c]!=0).',
            },
            {
                'category': cat_cond, 'phase': 'placement', 'difficulty': 'hard',
                'text': 'Найдите ошибку в условии проверки «корабли не касаются друг друга»:',
                'code_snippet': 'for dr in range(-1, 2):\n    for dc in range(-1, 2):\n        nr, nc = r+dr, c+dc\n        if 0 <= nr < 10 and 0 <= nc < 10:\n            if board[nr][nc] == 1:\n                return True  # <-- ошибка?',
                'option_a': 'Нужно return False (нельзя ставить)',
                'option_b': 'Нужно range(0, 2)',
                'option_c': 'Нужно board[nr][nc] == 0',
                'option_d': 'Ошибок нет',
                'correct_answer': 'A',
                'explanation': 'Если рядом есть корабль, ставить нельзя — нужно вернуть False, а не True.',
            },
            # === STRATEGY ===
            {
                'category': cat_algo, 'phase': 'strategy', 'difficulty': 'medium',
                'text': 'Какой принцип лежит в основе «шахматного» алгоритма стрельбы?',
                'code_snippet': 'if (row + col) % 2 == 0:\n    shoot(row, col)',
                'option_a': 'Стрелять только по диагонали',
                'option_b': 'Стрелять только в клетки с чётной суммой координат',
                'option_c': 'Стрелять по спирали',
                'option_d': 'Стрелять подряд по строкам',
                'correct_answer': 'B',
                'explanation': 'Шахматный паттерн: стреляем в клетки, где (row + col) % 2 == 0, как на шахматной доске.',
            },
            {
                'category': cat_algo, 'phase': 'strategy', 'difficulty': 'hard',
                'text': 'В алгоритме «Охотник», что делает ИИ после первого попадания?',
                'code_snippet': '',
                'option_a': 'Стреляет случайно', 'option_b': 'Стреляет по всем оставшимся клеткам',
                'option_c': 'Проверяет соседние клетки (вверх/вниз/влево/вправо)',
                'option_d': 'Останавливается и ждёт ответа на вопрос',
                'correct_answer': 'C',
                'explanation': 'Алгоритм «Охотник» при попадании добавляет соседей в очередь (аналог BFS) для добивания.',
            },
            {
                'category': cat_algo, 'phase': 'strategy', 'difficulty': 'medium',
                'text': 'Какая структура данных лучше для хранения списка стреляных клеток?',
                'code_snippet': '',
                'option_a': 'Строка (str)', 'option_b': 'Список (list)',
                'option_c': 'Множество (set)', 'option_d': 'Словарь (dict)',
                'correct_answer': 'C',
                'explanation': 'set обеспечивает O(1) проверку «стреляли ли уже в эту клетку».',
            },
            # === POSTMORTEM ===
            {
                'category': cat_algo, 'phase': 'postmortem', 'difficulty': 'hard',
                'text': 'Как оптимизировать поиск «стреляли ли мы сюда», заменив список на множество?',
                'code_snippet': 'shots = []  # текущая реализация\nif (r, c) in shots:  # O(n) поиск\n    ...',
                'option_a': 'shots = set(); shots.add((r,c)); (r,c) in shots',
                'option_b': 'shots = {}; shots[r] = c',
                'option_c': 'shots = tuple(); shots += ((r,c),)',
                'option_d': 'shots.sort(); bisect.bisect(shots, (r,c))',
                'correct_answer': 'A',
                'explanation': 'Множество (set) обеспечивает O(1) поиск вместо O(n) у списка.',
            },
            {
                'category': cat_func, 'phase': 'postmortem', 'difficulty': 'hard',
                'text': 'Какая сложность алгоритма случайной стрельбы в худшем случае?',
                'code_snippet': '',
                'option_a': 'O(1)', 'option_b': 'O(n)',
                'option_c': 'O(n²)', 'option_d': 'O(n·log n)',
                'correct_answer': 'C',
                'explanation': 'На поле 10×10 (n=10) в худшем случае нужно проверить все 100 клеток = O(n²).',
            },
            {
                'category': cat_loops, 'phase': 'battle', 'difficulty': 'medium',
                'text': 'Что выведет этот код?',
                'code_snippet': 'row = [0, 1, 0, 1, 0]\ncount = sum(1 for x in row if x == 1)\nprint(count)',
                'option_a': '5', 'option_b': '2',
                'option_c': '3', 'option_d': '0',
                'correct_answer': 'B',
                'explanation': 'В списке два элемента равных 1, поэтому count = 2.',
            },
            {
                'category': cat_arrays, 'phase': 'battle', 'difficulty': 'hard',
                'text': 'Как получить столбец col=3 из двумерного массива board?',
                'code_snippet': 'board = [[0]*10 for _ in range(10)]',
                'option_a': 'board[:, 3]', 'option_b': '[row[3] for row in board]',
                'option_c': 'board[3][:]', 'option_d': 'board.column(3)',
                'correct_answer': 'B',
                'explanation': 'В Python для списков нет срезов по столбцам — используем генератор списков.',
            },
            {
                'category': cat_cond, 'phase': 'general', 'difficulty': 'easy',
                'text': 'Какой оператор используется для логического «И» в Python?',
                'code_snippet': '',
                'option_a': '&&', 'option_b': 'AND',
                'option_c': 'and', 'option_d': '&',
                'correct_answer': 'C',
                'explanation': 'В Python логическое «И» записывается ключевым словом and (в нижнем регистре).',
            },
            {
                'category': cat_loops, 'phase': 'placement', 'difficulty': 'easy',
                'text': 'Какой результат range(0, 4)?',
                'code_snippet': 'for i in range(0, 4):\n    print(i, end=" ")',
                'option_a': '0 1 2 3', 'option_b': '1 2 3 4',
                'option_c': '0 1 2 3 4', 'option_d': '1 2 3',
                'correct_answer': 'A',
                'explanation': 'range(0, 4) генерирует 0, 1, 2, 3 — верхняя граница не включается.',
            },
            {
                'category': cat_func, 'phase': 'battle', 'difficulty': 'medium',
                'text': 'Что возвращает эта функция?',
                'code_snippet': 'def is_sunk(board, ship_cells):\n    return all(board[r][c] == 3 for r, c in ship_cells)',
                'option_a': 'True если все клетки корабля поражены',
                'option_b': 'Количество попаданий',
                'option_c': 'Список потопленных кораблей',
                'option_d': 'True если корабль цел',
                'correct_answer': 'A',
                'explanation': 'all() возвращает True, когда ВСЕ клетки корабля имеют значение 3 (попадание).',
            },
            {
                'category': cat_arrays, 'phase': 'general', 'difficulty': 'medium',
                'text': 'Как создать копию двумерного массива (глубокое копирование)?',
                'code_snippet': 'import copy\nboard = [[0]*10 for _ in range(10)]',
                'option_a': 'new = board', 'option_b': 'new = board.copy()',
                'option_c': 'new = copy.deepcopy(board)', 'option_d': 'new = list(board)',
                'correct_answer': 'C',
                'explanation': 'copy.deepcopy() создаёт полную независимую копию вложенных списков.',
            },
            {
                'category': cat_algo, 'phase': 'strategy', 'difficulty': 'easy',
                'text': 'Какой модуль Python используется для генерации случайных чисел?',
                'code_snippet': '',
                'option_a': 'math', 'option_b': 'random',
                'option_c': 'os', 'option_d': 'sys',
                'correct_answer': 'B',
                'explanation': 'Модуль random содержит функции для генерации случайных чисел.',
            },
            {
                'category': cat_algo, 'phase': 'postmortem', 'difficulty': 'medium',
                'text': 'Сколько клеток покрывает «шахматный» алгоритм на поле 10×10?',
                'code_snippet': 'cells = [(r,c) for r in range(10) for c in range(10) if (r+c)%2==0]',
                'option_a': '100', 'option_b': '50',
                'option_c': '25', 'option_d': '75',
                'correct_answer': 'B',
                'explanation': 'Половина клеток (50 из 100) имеют чётную сумму координат.',
            },
        ]

        created = 0
        for q in questions_data:
            _, was_created = Question.objects.get_or_create(
                text=q['text'],
                defaults=q,
            )
            if was_created:
                created += 1

        self.stdout.write(self.style.SUCCESS(f'Создано {created} вопросов (всего в базе: {Question.objects.count()})'))
