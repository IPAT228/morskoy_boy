'use strict';

const CATEGORY_ARTICLES={
  'Массивы':{
    title:'Массивы',
    sections:[
      {
        id:'idea',
        title:'Что это такое',
        text:'Массив — это структура данных, где несколько значений хранятся под одним именем. В игре используется двумерный массив: он похож на таблицу, где у каждой клетки есть строка и столбец.'
      },
      {
        id:'game',
        title:'Как связано с игрой',
        text:'Поле Морского боя хранится как матрица 10×10. Значения внутри неё показывают состояние клетки: 0 — пусто, 1 — корабль, 2 — промах, 3 — попадание, 4 — потоплено.'
      },
      {
        id:'example',
        title:'Пример',
        code:'board[3][5] = 1\nif board[r][c] == 1:\n    print("Попадание")',
        text:'Запись board[3][5] обращается к клетке в строке 3 и столбце 5. По такому принципу игра проверяет, есть ли в выбранной клетке корабль.'
      },
      {
        id:'remember',
        title:'Что запомнить',
        text:'Главная идея массивов в игре — любое поле можно представить как таблицу чисел. Это помогает программе быстро проверять клетки, обновлять поле и отображать результат выстрела.'
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
        text:'Условие позволяет программе выбрать действие в зависимости от ситуации. Если проверка истинна, выполняется один блок кода, если нет — другой.'
      },
      {
        id:'game',
        title:'Как связано с игрой',
        text:'Игра через условия определяет, можно ли поставить корабль, попал ли игрок, закончился ли бой, нужно ли задавать вопрос и кому передать ход.'
      },
      {
        id:'example',
        title:'Пример',
        code:'if grid[r][c] == 1:\n    result = "hit"\nelse:\n    result = "miss"',
        text:'Если в клетке находится корабль, выстрел считается попаданием. Иначе игра отмечает промах и передаёт ход по правилам.'
      },
      {
        id:'remember',
        title:'Что запомнить',
        text:'Условия превращают набор правил игры в программную логику. Они помогают компьютеру принимать решения на основе текущего состояния поля.'
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
        text:'Алгоритм — это последовательность действий для решения задачи. В Морском бое задача ИИ — выбрать клетку для выстрела так, чтобы быстрее найти корабли.'
      },
      {
        id:'game',
        title:'Как связано с игрой',
        text:'В игре есть разные стратегии противника: случайный выбор, шахматный обход, охотник после попадания и пользовательская стратегия со score.'
      },
      {
        id:'example',
        title:'Пример',
        code:'score = center_bonus + hit_bonus + random_bonus\nbest_cell = cell_with_max_score',
        text:'Пользовательская стратегия оценивает каждую свободную клетку. Чем выше score, тем выгоднее выстрелить именно туда.'
      },
      {
        id:'remember',
        title:'Что запомнить',
        text:'Алгоритм описывает не только что делает программа, но и почему она выбирает именно такое действие. Это основа поведения искусственного интеллекта в игре.'
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
});
