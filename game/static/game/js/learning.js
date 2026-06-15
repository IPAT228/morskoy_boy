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
        text:'Цикл нужен, когда одно действие нужно повторить много раз. Вместо того чтобы вручную описывать 100 клеток поля, программа проходит по ним автоматически.'
      },
      {
        id:'game',
        title:'Как связано с игрой',
        text:'Циклы используются при создании поля, обновлении матрицы, автоматической расстановке кораблей и поиске доступных клеток для выстрела.'
      },
      {
        id:'example',
        title:'Пример',
        code:'for r in range(10):\n    for c in range(10):\n        check_cell(r, c)',
        text:'Вложенный цикл сначала перебирает строки, а внутри каждой строки — столбцы. Так программа может проверить каждую клетку поля 10×10.'
      },
      {
        id:'remember',
        title:'Что запомнить',
        text:'Циклы помогают автоматизировать повторяющиеся действия. В Морском бое они особенно важны, потому что почти вся логика связана с обходом клеток поля.'
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
        text:'Функция — это отдельный блок кода, который выполняет конкретную задачу. Её можно вызвать много раз, передав разные параметры.'
      },
      {
        id:'game',
        title:'Как связано с игрой',
        text:'В игре функции отвечают за расстановку кораблей, проверку клетки, выстрел игрока, ход ИИ, вывод вопросов, обновление статистики и завершение боя.'
      },
      {
        id:'example',
        title:'Пример',
        code:'function canPlace(grid, r, c, size) {\n  return grid[r][c] === 0;\n}',
        text:'Функция canPlace проверяет, можно ли поставить корабль в выбранную область. Она получает данные на вход и возвращает результат проверки.'
      },
      {
        id:'remember',
        title:'Что запомнить',
        text:'Функции делают код понятнее: каждая часть игры получает своё название и свою ответственность. Такой код проще проверять и дорабатывать.'
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
        text:'В игре есть разные стратегии ИИ: случайный выбор, шахматный обход, охотник после попадания и пользовательская стратегия со score.'
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
