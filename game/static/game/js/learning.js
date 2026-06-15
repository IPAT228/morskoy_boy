'use strict';

const CATEGORY_ARTICLES={
  'Массивы':{
    title:'Массивы',
    sections:[
      {
        id:'idea',
        title:'Что это такое',
        text:'В Python массивы называются списками (list). Список хранит набор элементов под одним именем. Во многих языках программирования такая структура называется массивом. Источник: metanit.com — «Списки».'
      },
      {
        id:'create',
        title:'Создание списка',
        code:'numbers = [1, 2, 3, 4, 5]\npeople = ["Tom", "Sam", "Bob"]\n\nempty1 = []\nempty2 = list()\n\nboard_row = [0] * 10   # десять нулей',
        text:'Список создаётся в квадратных скобках, элементы перечисляются через запятую. Пустой список можно записать как [] или list(). Конструкция [0] * 10 повторяет значение 10 раз — удобно для строки игрового поля.'
      },
      {
        id:'index',
        title:'Индексы и элементы',
        code:'people = ["Tom", "Sam", "Bob"]\n\nprint(people[0])   # Tom\nprint(people[1])   # Sam\nprint(people[-1])  # Bob — последний\n\npeople[1] = "Mike"\nprint(people)      # ["Tom", "Mike", "Bob"]',
        text:'Индексы начинаются с нуля: первый элемент — [0], второй — [1]. Отрицательные индексы считают с конца: -1 — последний элемент. Элемент можно изменить, присвоив новое значение по индексу.'
      },
      {
        id:'nested',
        title:'Списки списков',
        code:'board = [\n    [0, 0, 0, 0, 0],\n    [0, 1, 1, 0, 0],\n    [0, 0, 0, 0, 0]\n]\n\nprint(board[1])      # вторая строка\nprint(board[1][1])   # клетка (1, 1)\n\nboard[1][1] = 3      # попадание',
        text:'Список может содержать другие списки. Такую структуру можно представить как таблицу: вложенные списки — строки, элементы внутри них — столбцы. Для обращения к клетке используют два индекса: board[строка][столбец].'
      },
      {
        id:'iterate',
        title:'Перебор элементов',
        code:'people = ["Tom", "Sam", "Bob"]\n\nfor person in people:\n    print(person)\n\ni = 0\nwhile i < len(people):\n    print(people[i])\n    i += 1',
        text:'Список можно обойти циклом for — каждый элемент по очереди попадает в переменную. Цикл while использует индекс и функцию len(), которая возвращает длину списка. Оба способа подходят для проверки всех клеток поля.'
      },
      {
        id:'methods',
        title:'Методы и оператор in',
        code:'cells = []\ncells.append(2)       # добавить в конец\ncells.insert(0, 0)    # вставить по индексу\n\nif 2 in cells:\n    cells.remove(2)\n\nprint(len(cells))     # длина списка',
        text:'Метод append() добавляет элемент в конец, insert() — в нужную позицию. Оператор in проверяет, есть ли значение в списке — так безопасно удалять элемент через remove(). Функция len() возвращает количество элементов.'
      },
      {
        id:'slice',
        title:'Срезы списка',
        code:'people = ["Tom", "Bob", "Alice", "Sam", "Tim"]\n\nprint(people[:3])     # первые три\nprint(people[1:3])    # с 1 по 3\nprint(people[1:5:2])  # с шагом 2\nprint(people[-3:-1])  # с конца',
        text:'Срез list[start:end:step] возвращает часть списка. start — начальный индекс, end — конечный (не включается), step — шаг. Отрицательные индексы позволяют брать элементы с конца. Срезы не меняют исходный список.'
      },
      {
        id:'game',
        title:'Как связано с игрой',
        text:'Поле Морского боя — матрица 10×10: список из десяти строк, каждая строка — список из десяти чисел. Значения клеток: 0 — пусто, 1 — корабль, 2 — промах, 3 — попадание, 4 — потоплено. Запись board[r][c] обращается к клетке в строке r и столбце c.'
      },
      {
        id:'remember',
        title:'Что запомнить',
        text:'Список в Python — это гибкий массив: индексы, срезы, вложенные списки и методы append/in/len. Игровое поле — двумерный список, по которому программа быстро проверяет клетки, обновляет состояние и отображает результат выстрела.'
      }
    ]
  },
  'Циклы':{
    title:'Циклы',
    sections:[
      {
        id:'idea',
        title:'Что это такое',
        text:'Цикл позволяет выполнять одни и те же действия много раз, пока выполняется условие или пока не перебран набор значений. В Python есть два основных типа циклов: while и for. Источник: metanit.com — «Циклы».'
      },
      {
        id:'while',
        title:'Цикл while',
        code:'number = 1\n\nwhile number < 5:\n    print(f"number = {number}")\n    number += 1\n\nprint("Работа программы завершена")',
        text:'Цикл while проверяет условие перед каждой итерацией. Пока условие истинно (True), выполняется блок инструкций с отступом. Когда условие становится ложным, цикл завершается, и программа переходит к следующим строкам. Одно выполнение тела цикла называется итерацией.'
      },
      {
        id:'while-else',
        title:'Блок else у while',
        code:'number = 1\n\nwhile number < 5:\n    print(f"number = {number}")\n    number += 1\nelse:\n    print(f"number = {number}. Работа цикла завершена")',
        text:'У цикла while может быть блок else. Его инструкции выполняются, когда условие цикла становится ложным и цикл завершился естественным образом. Если цикл не выполнил ни одной итерации, управление сразу переходит в else.'
      },
      {
        id:'for',
        title:'Цикл for',
        code:'message = "Hello"\n\nfor c in message:\n    print(c)',
        text:'Цикл for перебирает элементы набора значений: строку, список, диапазон и другие коллекции. Каждое значение по очереди помещается в переменную, после чего выполняется тело цикла.'
      },
      {
        id:'range',
        title:'Функция range()',
        code:'for n in range(10):\n    print(n, end=" ")\n\nfor n in range(4, 10):\n    print(n, end=" ")\n\nfor n in range(0, 10, 2):\n    print(n, end=" ")',
        text:'Функция range() часто используется с for для генерации числовой последовательности. range(10) даёт числа от 0 до 9. range(4, 10) — от 4 до 9. Третий аргумент задаёт шаг: range(0, 10, 2) выводит 0, 2, 4, 6, 8.'
      },
      {
        id:'nested',
        title:'Вложенные циклы',
        code:'for r in range(10):\n    for c in range(10):\n        print(f"({r},{c})", end=" ")\n    print()',
        text:'Один цикл может находиться внутри другого. Внешний цикл управляет строками, внутренний — столбцами. Для поля 10×10 внутренний цикл выполняется 10 раз на каждую итерацию внешнего, то есть всего 100 проверок клеток.'
      },
      {
        id:'break-continue',
        title:'break и continue',
        code:'number = 0\nwhile number < 5:\n    number += 1\n    if number == 3:\n        continue\n    print(f"number = {number}")',
        text:'Оператор break полностью выходит из цикла. Оператор continue пропускает оставшиеся инструкции текущей итерации и переходит к следующей. Эти команды помогают управлять сложными сценариями, когда нужно досрочно остановиться или пропустить шаг.'
      },
      {
        id:'game',
        title:'Как связано с игрой',
        text:'В Морском бое циклы используются при создании поля, обходе клеток, автоматической расстановке кораблей, обновлении матрицы и поиске доступных клеток для выстрела противника. Вложенный цикл for по range(10) — это стандартный способ пройти всё игровое поле.'
      },
      {
        id:'remember',
        title:'Что запомнить',
        text:'while удобен, когда заранее неизвестно, сколько повторений понадобится. for удобен, когда нужно перебрать известный набор значений. Вместе с range(), break и continue циклы позволяют автоматизировать почти всю работу с клетками поля.'
      }
    ]
  },
  'Условия':{
    title:'Условия',
    sections:[
      {
        id:'idea',
        title:'Что это такое',
        text:'Условные выражения возвращают логическое значение типа bool: True (истина) или False (ложь). На их основе программа выбирает, какой блок кода выполнить. Источник: metanit.com — «Условные выражения» и «Условная конструкция if».'
      },
      {
        id:'compare',
        title:'Операции сравнения',
        code:'a = 5\nb = 6\n\nprint(a == b)   # False — равно\nprint(a != b)   # True  — не равно\nprint(a > b)    # False\nprint(a < b)    # True\nprint(a >= 5)   # True\nprint(a <= 4)   # False',
        text:'Операции ==, !=, >, <, >=, <= сравнивают два значения и возвращают True или False. Оба операнда должны быть одного типа. Результат сравнения можно сохранить в переменную и использовать в условии.'
      },
      {
        id:'logic',
        title:'Логические операции',
        code:'age = 22\nweight = 58\n\nprint(age > 21 and weight == 58)  # True\nprint(age > 30 or weight == 58)   # True\nprint(not age > 21)               # False',
        text:'Оператор and возвращает True, только если оба выражения истинны. or — если хотя бы одно истинно. not инвертирует результат. Составные условия позволяют проверять сразу несколько правил игры.'
      },
      {
        id:'in-operator',
        title:'Оператор in',
        code:'message = "hello world!"\nprint("hello" in message)      # True\nprint("gold" not in message)   # True\n\nships = [1, 2, 3, 4]\nprint(3 in ships)              # True',
        text:'Выражение значение in набор проверяет, содержится ли элемент в строке, списке или другой коллекции. not in даёт обратный результат. В игре in удобен для проверки, есть ли клетка в списке доступных для выстрела.'
      },
      {
        id:'if',
        title:'Конструкция if',
        code:'language = "english"\nif language == "english":\n    print("Hello")\nprint("End")',
        text:'После if пишут логическое выражение и двоеточие. Блок инструкций с отступом выполняется только если условие истинно. Строки без отступа не входят в if и выполняются всегда — это важно при чтении кода.'
      },
      {
        id:'elif-else',
        title:'elif и else',
        code:'cell = 1\n\nif cell == 1:\n    result = "hit"\nelif cell == 2:\n    result = "miss"\nelse:\n    result = "empty"\n\nprint(result)',
        text:'Блок else выполняется, если условие if ложно. Блоки elif проверяют дополнительные варианты по очереди. Python выполняет только один подходящий блок: if, один из elif или else.'
      },
      {
        id:'nested',
        title:'Вложенные условия',
        code:'language = "english"\ndaytime = "morning"\n\nif language == "english":\n    if daytime == "morning":\n        print("Good morning")\n    else:\n        print("Good evening")',
        text:'Конструкция if может находиться внутри другой if. Вложенные условия проверяют ситуацию по шагам: сначала общее правило, затем частный случай. Отступы определяют, к какому блоку относится каждая строка.'
      },
      {
        id:'game',
        title:'Как связано с игрой',
        text:'Игра через условия решает: можно ли поставить корабль, попал ли выстрел, потоплен ли корабль, закончился ли бой, нужен ли бонусный выстрел и чей сейчас ход. Например, if grid[r][c] == 1 — попадание, иначе — промах.'
      },
      {
        id:'remember',
        title:'Что запомнить',
        text:'Сравнения и логика (and, or, not, in) формируют условие. Конструкция if / elif / else направляет программу по нужной ветке. Условия превращают правила Морского боя в исполняемый код.'
      }
    ]
  },
  'Функции':{
    title:'Функции',
    sections:[
      {
        id:'idea',
        title:'Что это такое',
        text:'Функция — это именованный блок кода, который выполняет определённую задачу и может использоваться повторно. В Python функции определяются через def. Источник: metanit.com — «Функции».'
      },
      {
        id:'define',
        title:'Определение и вызов',
        code:'def say_hello():\n    print("Hello")\n\n\ndef say_goodbye():\n    print("Good Bye")\n\n\nsay_hello()\nsay_goodbye()',
        text:'Определение начинается с def, затем идёт имя функции, скобки, двоеточие и блок инструкций с отступом. Чтобы выполнить функцию, нужно написать её имя и скобки: say_hello(). Функцию сначала определяют, потом вызывают.'
      },
      {
        id:'one-line',
        title:'Короткая запись',
        code:'def say_hello(): print("Hello")\n\nsay_hello()',
        text:'Если в функции только одна инструкция, её можно записать в одну строку вместе с def. Такой формат удобен для простых действий, но для сложной логики лучше использовать многострочный блок.'
      },
      {
        id:'local',
        title:'Локальные функции',
        code:'def print_messages():\n    def say_hello():\n        print("Hello")\n\n    def say_goodbye():\n        print("Good Bye")\n\n    say_hello()\n    say_goodbye()\n\n\nprint_messages()',
        text:'Функцию можно определить внутри другой функции. Такая внутренняя функция называется локальной и доступна только внутри внешней. Это помогает скрыть вспомогательные действия и не загромождать общую область программы.'
      },
      {
        id:'main',
        title:'Функция main',
        code:'def main():\n    say_hello()\n    say_goodbye()\n\n\ndef say_hello():\n    print("Hello")\n\n\ndef say_goodbye():\n    print("Good Bye")\n\n\nmain()',
        text:'Чтобы упорядочить программу, часто создают функцию main(), которая запускает остальные функции. Так код становится структурированным: отдельные задачи разнесены по функциям, а main управляет общим сценарием.'
      },
      {
        id:'game',
        title:'Как связано с игрой',
        text:'В игре функции отвечают за расстановку кораблей, проверку клетки, выстрел игрока, ход противника, показ вопросов, обновление статистики и завершение боя. Например, canPlace() проверяет, можно ли поставить корабль, а renderBoard() отображает поле.'
      },
      {
        id:'example',
        title:'Пример из игры',
        code:'def can_place(grid, r, c, size, vertical):\n    for i in range(size):\n        nr = r + i if vertical else r\n        nc = c if vertical else c + i\n        if grid[nr][nc] != 0:\n            return False\n    return True',
        text:'Функция can_place получает параметры на вход и возвращает результат проверки. Если хотя бы одна клетка занята, функция возвращает False. Так игрок узнаёт, можно ли разместить корабль в выбранной позиции.'
      },
      {
        id:'remember',
        title:'Что запомнить',
        text:'Функции делают код понятнее и короче: каждая часть программы получает своё имя и свою задачу. Локальные функции и main помогают организовать сложную логику, а параметры и return позволяют передавать данные и получать результат.'
      }
    ]
  },
  'Алгоритмы':{
    title:'Алгоритмы',
    sections:[
      {
        id:'idea',
        title:'Что это такое',
        text:'Алгоритм — это последовательность шагов для решения задачи. Списки часто упрощают алгоритмы: перебор, фильтрация и выбор лучшего элемента. Источник: metanit.com — «Списки и алгоритмы», «Модуль random».'
      },
      {
        id:'search',
        title:'Перебор и поиск',
        code:'board = [[0]*10 for _ in range(10)]\navailable = []\n\nfor r in range(10):\n    for c in range(10):\n        if board[r][c] == 0:\n            available.append((r, c))\n\nprint(f"Свободных клеток: {len(available)}")',
        text:'Линейный поиск проходит по всем элементам списка или матрицы и проверяет условие. В игре так собирают клетки, куда ещё не стреляли. Чем меньше остаётся свободных клеток, тем быстрее перебор.'
      },
      {
        id:'random',
        title:'Модуль random',
        code:'import random\n\nn = random.randint(0, 9)       # целое от 0 до 9\nx = random.randrange(0, 10, 2) # 0, 2, 4, 6, 8\n\ncells = [(0, 0), (3, 5), (7, 2)]\nr, c = random.choice(cells)\n\nrandom.shuffle(cells)          # перемешать список',
        text:'Функция randint(min, max) возвращает случайное целое число в диапазоне. randrange работает как range(), но выбирает одно значение. choice() берёт случайный элемент списка, shuffle() перемешивает список на месте.'
      },
      {
        id:'random-strategy',
        title:'Случайная стратегия',
        code:'import random\n\navailable = [(0, 1), (2, 3), (5, 5)]\n\nif available:\n    r, c = random.choice(available)\n    print(f"Выстрел: ({r}, {c})")',
        text:'Случайный алгоритм выбирает клетку из списка доступных через random.choice(). Это простой, но не самый эффективный способ: противник может долго «искать» корабли. Сложность в худшем случае — O(n²) для поля 10×10.'
      },
      {
        id:'score',
        title:'Алгоритм с оценкой',
        code:'best_score = -1\nbest_cell = None\n\nfor r, c in available:\n    score = center_bonus + hit_bonus\n    score += random.random() * randomness\n    if score > best_score:\n        best_score = score\n        best_cell = (r, c)',
        text:'Алгоритм с оценкой (score) проходит по кандидатам и выбирает лучший. Каждой клетке начисляются бонусы: за близость к центру, за соседство с попаданием. Случайная добавка делает поведение менее предсказуемым.'
      },
      {
        id:'hunter',
        title:'Охотник после попадания',
        code:'if last_hit:\n    for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:\n        nr, nc = last_hit[0]+dr, last_hit[1]+dc\n        if 0 <= nr < 10 and 0 <= nc < 10:\n            if (nr, nc) not in shots:\n                target = (nr, nc)\n                break',
        text:'После попадания алгоритм «охотник» проверяет соседние клетки по четырём направлениям. Так корабль находят быстрее, чем при чисто случайных выстрелах. Это пример алгоритма, который меняет стратегию в зависимости от ситуации.'
      },
      {
        id:'game',
        title:'Как связано с игрой',
        text:'В игре пять стратегий противника: случайный выбор, шахматный обход, охотник после попадания, «Решатель» (плотность вероятности) и пользовательская стратегия с настройками parity, densityWeight, centerWeight, hitPriority и randomness. Каждая — отдельный алгоритм принятия решения.'
      },
      {
        id:'remember',
        title:'Что запомнить',
        text:'Алгоритм — это шаги + критерий выбора. Перебор списка, random.choice и поиск максимального score — три базовых приёма в игре. Хороший алгоритм не только выполняет действие, но и объясняет, почему выбрана именно эта клетка.'
      }
    ]
  }
};

let selectedSectionId='idea';

function applyQuestionCategory(category){
  const selected=CATEGORY_ARTICLES[category]?category:'Массивы';
  localStorage.setItem('questionCategory',selected);
  selectedSectionId='idea';
  document.querySelectorAll('.learning-category').forEach(btn=>{
    btn.classList.toggle('active',btn.dataset.questionCategory===selected);
  });
  document.getElementById('selectedCategoryLabel').textContent=`Тема: ${selected}`;
  renderLearningDocs(selected);
}

function renderLearningDocs(category){
  const article=CATEGORY_ARTICLES[category];
  const activeSection=article.sections.find(section=>section.id===selectedSectionId)||article.sections[0];
  const nav=article.sections.map(section=>`
    <button class="learning-docs-tab ${section.id===activeSection.id?'active':''}" type="button" data-doc-section="${section.id}">
      ${section.title}
    </button>
  `).join('');
  document.getElementById('learningArticle').innerHTML=`
    <aside class="learning-docs-nav" aria-label="Разделы темы">${nav}</aside>
    <div class="learning-docs-content">
      <div class="card-title">Материал по теме</div>
      <h2>${article.title}: ${activeSection.title}</h2>
      <p>${activeSection.text}</p>
      ${activeSection.code?`<pre class="learning-docs-code"><code>${activeSection.code}</code></pre>`:''}
    </div>
  `;
  document.querySelectorAll('.learning-docs-tab').forEach(btn=>{
    btn.addEventListener('click',()=>{
      selectedSectionId=btn.dataset.docSection;
      renderLearningDocs(category);
    });
  });
}

document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.learning-category').forEach(btn=>{
    btn.addEventListener('click',()=>applyQuestionCategory(btn.dataset.questionCategory));
  });
  applyQuestionCategory(localStorage.getItem('questionCategory')||'Массивы');

  const goToGame=document.getElementById('btnGoToGame');
  if(goToGame){
    goToGame.addEventListener('click',()=>{
      localStorage.setItem('topicConfirmed','1');
    });
  }
});
