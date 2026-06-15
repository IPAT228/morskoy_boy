/* ===========================================
   Морской Бой — Обучающая игра по информатике
   =========================================== */
'use strict';

const SIZE = 10;
const SHIPS = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
const SHIP_NAMES = {4:'4-палубный',3:'3-палубный',2:'2-палубный',1:'1-палубный'};
const COLS = 'АБВГДЕЖЗИК'.split('');

// --- State ---
let phase = 'placement'; // placement | battle | ended
let playerGrid = [], aiGrid = [], aiVisible = [];
let playerShips = [], aiShips = [];
let placementIdx = 0, placementVertical = false;
let aiStrategy = 'random';
let stats = {pShots:0,pHits:0,aShots:0,aHits:0,qAnswered:0,qCorrect:0};
let isPlayerTurn = true;
let bonusShotAvailable = false;
let questions = [];
let aiHuntQueue = [], aiShotSet = new Set();
let aiCheckerParity = 0, aiCheckerCells = [];
let customStrategyConfig = loadCustomStrategyConfig();
let customStrategyTestPassed = false;
let selectedQuestionCategory = localStorage.getItem('questionCategory') || 'Массивы';

// --- Init ---
function makeGrid(){return Array.from({length:SIZE},()=>Array(SIZE).fill(0));}
function init(){
  playerGrid=makeGrid(); aiGrid=makeGrid(); aiVisible=makeGrid();
  playerShips=[]; aiShips=[];
  placementIdx=0; placementVertical=false;
  stats={pShots:0,pHits:0,aShots:0,aHits:0,qAnswered:0,qCorrect:0};
  isPlayerTurn=true; bonusShotAvailable=false; phase='placement';
  aiHuntQueue=[]; aiShotSet=new Set();
  aiCheckerParity=0;
  aiCheckerCells=[];
  for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++)if((r+c)%2===0)aiCheckerCells.push([r,c]);
  shuffle(aiCheckerCells);
  renderBoards(); updateMatrix(); updateStats(); updatePhase();
  updatePlacementUI();
  document.getElementById('btnNewGame').classList.add('hidden');
  document.getElementById('turnIndicator').textContent='';
  document.getElementById('logEntries').innerHTML='<div class="log-entry">Игра готова. Расставьте корабли!</div>';
  fetchQuestions();
}

// --- Board rendering ---
function renderBoards(){
  renderBoard('playerBoard','playerCoordsTop','playerCoordsLeft',playerGrid,true);
  renderBoard('aiBoard','aiCoordsTop','aiCoordsLeft',aiVisible,false);
}
function renderBoard(boardId,topId,leftId,grid,isPlayer){
  const bEl=document.getElementById(boardId);
  const topEl=document.getElementById(topId);
  const leftEl=document.getElementById(leftId);
  topEl.innerHTML=COLS.map(c=>`<span>${c}</span>`).join('');
  leftEl.innerHTML=Array.from({length:SIZE},(_,i)=>`<span>${i+1}</span>`).join('');
  bEl.innerHTML='';
  for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++){
    const cell=document.createElement('div');
    cell.className='cell'+getCellClass(grid[r][c],isPlayer);
    cell.dataset.r=r; cell.dataset.c=c;
    if(isPlayer&&phase==='placement'){
      cell.addEventListener('mouseenter',()=>previewShip(r,c));
      cell.addEventListener('mouseleave',clearPreview);
      cell.addEventListener('click',()=>placeShipAt(r,c));
      cell.addEventListener('contextmenu',e=>{e.preventDefault();toggleRotation();});
    }
    if(!isPlayer&&phase==='battle'){
      cell.addEventListener('click',()=>playerShoot(r,c));
    }
    bEl.appendChild(cell);
  }
}
function getCellClass(v,isPlayer){
  if(v===1&&isPlayer)return ' cell-ship';
  if(v===2)return ' cell-miss';
  if(v===3)return ' cell-hit';
  if(v===4)return ' cell-sunk';
  return '';
}
function refreshCell(boardId,grid,r,c,isPlayer){
  const bEl=document.getElementById(boardId);
  const cell=bEl.children[r*SIZE+c];
  cell.className='cell'+getCellClass(grid[r][c],isPlayer);
}

// --- Placement ---
function canPlace(grid,r,c,size,vert,ships){
  for(let i=0;i<size;i++){
    let nr=vert?r+i:r, nc=vert?c:c+i;
    if(nr>=SIZE||nc>=SIZE)return false;
    if(grid[nr][nc]!==0)return false;
    for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){
      let ar=nr+dr,ac=nc+dc;
      if(ar>=0&&ar<SIZE&&ac>=0&&ac<SIZE&&grid[ar][ac]===1)return false;
    }
  }
  return true;
}
function placeShip(grid,ships,r,c,size,vert){
  let cells=[];
  for(let i=0;i<size;i++){
    let nr=vert?r+i:r, nc=vert?c:c+i;
    grid[nr][nc]=1; cells.push([nr,nc]);
  }
  ships.push({size,cells,hits:0});
}
function previewShip(r,c){
  if(phase!=='placement'||placementIdx>=SHIPS.length)return;
  const size=SHIPS[placementIdx];
  const valid=canPlace(playerGrid,r,c,size,placementVertical,[]);
  const bEl=document.getElementById('playerBoard');
  for(let i=0;i<size;i++){
    let nr=placementVertical?r+i:r, nc=placementVertical?c:c+i;
    if(nr<SIZE&&nc<SIZE){
      bEl.children[nr*SIZE+nc].classList.add(valid?'cell-preview':'cell-preview-invalid');
    }
  }
}
function clearPreview(){
  document.querySelectorAll('.cell-preview,.cell-preview-invalid').forEach(el=>{
    el.classList.remove('cell-preview','cell-preview-invalid');
  });
}
function toggleRotation(){placementVertical=!placementVertical;}
document.addEventListener('keydown',e=>{if(e.key==='r'||e.key==='R')toggleRotation();});

function placeShipAt(r,c){
  if(phase!=='placement'||placementIdx>=SHIPS.length)return;
  const size=SHIPS[placementIdx];
  if(!canPlace(playerGrid,r,c,size,placementVertical,[]))return;
  placeShip(playerGrid,playerShips,r,c,size,placementVertical);
  placementIdx++;
  if(placementIdx>=SHIPS.length)addLog('Все корабли расставлены!');
  updatePlacementUI();
  renderBoards();
}
function resetPlacement(){
  if(phase!=='placement')return;
  playerGrid=makeGrid(); playerShips=[];
  placementIdx=0; placementVertical=false;
  updatePlacementUI();
  renderBoards();
  addLog('Расстановка сброшена. Расставьте корабли заново.');
}
function updatePlacementUI(){
  const controls=document.getElementById('placementControls');
  const info=document.getElementById('placementInfo');
  const allPlaced=placementIdx>=SHIPS.length;
  if(phase==='placement'){
    controls.classList.remove('hidden');
    document.getElementById('btnResetPlacement').disabled=placementIdx===0;
    if(allPlaced){
      info.classList.add('hidden');
      document.getElementById('btnStartBattle').classList.remove('hidden');
    }else{
      info.classList.remove('hidden');
      document.getElementById('btnStartBattle').classList.add('hidden');
      document.getElementById('placementShipName').textContent=
        `${SHIP_NAMES[SHIPS[placementIdx]]||SHIPS[placementIdx]+'-палубный'} корабль (${placementIdx+1}/${SHIPS.length})`;
    }
  }else{
    controls.classList.add('hidden');
    info.classList.add('hidden');
  }
}
function autoPlace(){
  playerGrid=makeGrid(); playerShips=[];
  placeShipsRandomly(playerGrid,playerShips);
  placementIdx=SHIPS.length;
  updatePlacementUI();
  renderBoards();
  addLog('Корабли расставлены автоматически.');
}
function placeShipsRandomly(grid,ships){
  for(const size of SHIPS){
    let placed=false,attempts=0;
    while(!placed&&attempts<1000){
      attempts++;
      const vert=Math.random()<0.5;
      const r=Math.floor(Math.random()*(vert?SIZE-size+1:SIZE));
      const c=Math.floor(Math.random()*(vert?SIZE:SIZE-size+1));
      if(canPlace(grid,r,c,size,vert,[])){placeShip(grid,r,c,size,vert);placed=true;}
    }
  }
  function placeShip(g,r,c,s,v){
    let cells=[];
    for(let i=0;i<s;i++){let nr=v?r+i:r,nc=v?c:c+i;g[nr][nc]=1;cells.push([nr,nc]);}
    ships.push({size:s,cells,hits:0});
  }
}

// --- Battle ---
function startBattle(){
  aiGrid=makeGrid(); aiShips=[];
  placeShipsRandomly(aiGrid,aiShips);
  phase='battle'; updatePhase();
  document.getElementById('btnStartBattle').classList.add('hidden');
  updatePlacementUI();
  document.getElementById('btnNewGame').classList.remove('hidden');
  renderBoards(); updateMatrix();
  addLog('Бой начался! Стреляйте по полю противника.');
  document.getElementById('turnIndicator').innerHTML='<span class="turn-player">▶ Ваш ход</span>';
  maybeAskQuestion('placement');
}

function playerShoot(r,c){
  if(phase!=='battle'||!isPlayerTurn)return;
  if(aiVisible[r][c]!==0)return;
  const wasBonusShot=bonusShotAvailable;
  bonusShotAvailable=false;
  stats.pShots++;
  if(aiGrid[r][c]===1){
    aiVisible[r][c]=3; aiGrid[r][c]=3; stats.pHits++;
    let ship=aiShips.find(s=>s.cells.some(([sr,sc])=>sr===r&&sc===c));
    if(ship){ship.hits++;
      if(ship.hits===ship.size){
        ship.cells.forEach(([sr,sc])=>{aiVisible[sr][sc]=4;aiGrid[sr][sc]=4;});
        markSurrounding(aiVisible,ship.cells);markSurrounding(aiGrid,ship.cells);
        addLog(`<span class="log-player">Вы</span> потопили <span class="log-sunk">${SHIP_NAMES[ship.size]}!</span>`);
      } else {
        addLog(`<span class="log-player">Вы</span>: ${COLS[c]}${r+1} — <span class="log-hit">Попадание!</span>`);
      }
    }
    refreshAiBoard(); updateMatrix(); updateStats();
    if(checkWin(aiShips)){endGame('player');return;}
  } else {
    aiVisible[r][c]=2;
    addLog(`<span class="log-player">Вы</span>: ${COLS[c]}${r+1} — <span class="log-miss">Промах</span>`);
    refreshAiBoard(); updateMatrix(); updateStats();
    if(wasBonusShot){
      addLog('Дополнительный выстрел был промахом — ход переходит компьютеру.');
      passTurnToAi();
    } else {
      maybeAskSecondShotQuestion();
    }
    return;
  }
  updateStats();
}
function passTurnToAi(){
  isPlayerTurn=false;
  document.getElementById('turnIndicator').innerHTML='<span class="turn-ai">▶ Ход компьютера...</span>';
  setTimeout(aiTurn,600);
}
function refreshAiBoard(){
  for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++)refreshCell('aiBoard',aiVisible,r,c,false);
}
function markSurrounding(grid,cells){
  cells.forEach(([r,c])=>{
    for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){
      let nr=r+dr,nc=c+dc;
      if(nr>=0&&nr<SIZE&&nc>=0&&nc<SIZE&&grid[nr][nc]===0)grid[nr][nc]=2;
    }
  });
}
function checkWin(ships){return ships.every(s=>s.hits===s.size);}

// --- Probability density solver (плотность вероятности) ---
// Hunt: parity-сетка по размеру крупнейшего оставшегося корабля (DataGenetics).
// Target: добивание по линии попаданий + плотность размещений через известные hit.
function getRemainingShipSizes(){
  return playerShips.filter(s=>s.hits<s.size).map(s=>s.size);
}
function getActiveHits(grid){
  const hits=[];
  for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++)if(grid[r][c]===3)hits.push([r,c]);
  return hits;
}
function getPrimaryHitCluster(hits){
  if(hits.length===0)return [];
  const hitSet=new Set(hits.map(([r,c])=>r+','+c));
  const cluster=[],queue=[hits[0]],seen=new Set([hits[0][0]+','+hits[0][1]]);
  while(queue.length){
    const [r,c]=queue.shift();
    cluster.push([r,c]);
    [[r-1,c],[r+1,c],[r,c-1],[r,c+1]].forEach(([nr,nc])=>{
      const key=nr+','+nc;
      if(hitSet.has(key)&&!seen.has(key)){seen.add(key);queue.push([nr,nc]);}
    });
  }
  return cluster;
}
function getHuntParityStep(remainingSizes){
  if(remainingSizes.length===0)return 2;
  const largest=Math.max(...remainingSizes);
  return largest>=2?largest:2;
}
function isHuntParityCell(r,c,step){
  return (r+c)%step===0;
}
function placementCovers(shipR,shipC,size,vertical,targetR,targetC){
  for(let i=0;i<size;i++){
    const nr=vertical?shipR+i:shipR;
    const nc=vertical?shipC:shipC+i;
    if(nr===targetR&&nc===targetC)return true;
  }
  return false;
}
function canPlaceShipForDensity(grid,shipR,shipC,size,vertical,activeHits){
  const cells=[];
  for(let i=0;i<size;i++){
    const nr=vertical?shipR+i:shipR;
    const nc=vertical?shipC:shipC+i;
    if(nr>=SIZE||nc>=SIZE)return false;
    const v=grid[nr][nc];
    if(v===2||v===4)return false;
    if(v!==0&&v!==3)return false;
    cells.push([nr,nc]);
  }
  if(activeHits.length===0)return true;
  return activeHits.every(([hr,hc])=>cells.some(([nr,nc])=>nr===hr&&nc===hc));
}
function countPlacementsCoveringCell(grid,targetR,targetC,shipSize,activeHits){
  let count=0;
  for(const vertical of [false,true]){
    for(let r=0;r<SIZE;r++){
      for(let c=0;c<SIZE;c++){
        if(!placementCovers(r,c,shipSize,vertical,targetR,targetC))continue;
        if(canPlaceShipForDensity(grid,r,c,shipSize,vertical,activeHits))count++;
      }
    }
  }
  return count;
}
function probabilityDensityAt(grid,r,c,remainingSizes,activeHits){
  let density=0;
  for(const size of remainingSizes){
    density+=countPlacementsCoveringCell(grid,r,c,size,activeHits);
  }
  return density;
}
function centerWeight(r,c){
  return 9-(Math.abs(r-4.5)+Math.abs(c-4.5));
}
function inferLineDirection(cluster){
  if(cluster.length<2)return null;
  if(cluster.every(([r])=>r===cluster[0][0]))return 'h';
  if(cluster.every(([,c])=>c===cluster[0][1]))return 'v';
  return null;
}
function targetCellBonus(r,c,cluster){
  if(cluster.length===0)return 0;
  const dir=inferLineDirection(cluster);
  if(dir==='h'&&r===cluster[0][0])return 80;
  if(dir==='v'&&c===cluster[0][1])return 80;
  if(cluster.length===1){
    const [hr,hc]=cluster[0];
    if(Math.abs(r-hr)+Math.abs(c-hc)===1)return 40;
  }
  return 0;
}
function pickBestProbabilityCell(candidates,grid,remainingSizes,activeHits,cluster){
  let best=candidates[0],bestScore=-Infinity;
  candidates.forEach(([r,c])=>{
    let score=probabilityDensityAt(grid,r,c,remainingSizes,activeHits);
    score+=centerWeight(r,c)*0.4;
    if(cluster.length>0)score+=targetCellBonus(r,c,cluster);
    score+=Math.random()*0.001;
    if(score>bestScore){bestScore=score;best=[r,c];}
  });
  return best;
}
function chooseProbabilityDensityShot(grid=playerGrid,shotSet=aiShotSet){
  const remainingSizes=getRemainingShipSizes();
  let available=availableCellsForGrid(grid,shotSet);
  if(available.length===0)return [undefined,undefined];
  if(remainingSizes.length===0)return [available[0][0],available[0][1]];

  const allHits=getActiveHits(grid);
  const cluster=getPrimaryHitCluster(allHits);

  if(cluster.length>0){
    const adjacent=adjacentHitTargets(grid,shotSet);
    let candidates=adjacent;
    if(candidates.length===0){
      const dir=inferLineDirection(cluster);
      if(dir==='h'){
        const row=cluster[0][0];
        candidates=available.filter(([r])=>r===row);
      }else if(dir==='v'){
        const col=cluster[0][1];
        candidates=available.filter(([,c])=>c===col);
      }else{
        candidates=available;
      }
    }
    return pickBestProbabilityCell(candidates,grid,remainingSizes,cluster,cluster);
  }

  const parityStep=getHuntParityStep(remainingSizes);
  const parityCells=available.filter(([r,c])=>isHuntParityCell(r,c,parityStep));
  const candidates=parityCells.length>0?parityCells:available;
  return pickBestProbabilityCell(candidates,grid,remainingSizes,[],[]);
}

// --- AI Turn ---
function aiTurn(){
  if(phase!=='battle')return;
  let r,c;
  if(aiStrategy==='custom'){
    [r,c]=chooseCustomShot();
  }
  if(r===undefined&&aiStrategy==='probability'){
    [r,c]=chooseProbabilityDensityShot();
  }
  if(r===undefined&&aiStrategy==='hunter'&&aiHuntQueue.length>0){
    while(aiHuntQueue.length>0){
      [r,c]=aiHuntQueue.shift();
      if(!aiShotSet.has(r+','+c)&&r>=0&&r<SIZE&&c>=0&&c<SIZE)break;
      r=undefined;
    }
  }
  if(r===undefined){
    if(aiStrategy==='checkerboard'){
      while(aiCheckerCells.length>0){
        [r,c]=aiCheckerCells.shift();
        if(!aiShotSet.has(r+','+c))break;
        r=undefined;
      }
    }
    if(r===undefined){
      let avail=[];
      for(let i=0;i<SIZE;i++)for(let j=0;j<SIZE;j++){
        if(!aiShotSet.has(i+','+j))avail.push([i,j]);
      }
      if(avail.length===0)return;
      [r,c]=avail[Math.floor(Math.random()*avail.length)];
    }
  }
  aiShotSet.add(r+','+c); stats.aShots++;
  if(playerGrid[r][c]===1){
    playerGrid[r][c]=3; stats.aHits++;
    let ship=playerShips.find(s=>s.cells.some(([sr,sc])=>sr===r&&sc===c));
    if(ship){ship.hits++;
      if(aiStrategy==='hunter'){
        [[r-1,c],[r+1,c],[r,c-1],[r,c+1]].forEach(([nr,nc])=>{
          if(nr>=0&&nr<SIZE&&nc>=0&&nc<SIZE&&!aiShotSet.has(nr+','+nc))aiHuntQueue.push([nr,nc]);
        });
      }
      if(ship.hits===ship.size){
        ship.cells.forEach(([sr,sc])=>{playerGrid[sr][sc]=4;});
        markSurrounding(playerGrid,ship.cells);
        addLog(`<span class="log-ai">Противник</span> потопил <span class="log-sunk">${SHIP_NAMES[ship.size]}!</span>`);
        aiHuntQueue=[];
      } else {
        addLog(`<span class="log-ai">Противник</span>: ${COLS[c]}${r+1} — <span class="log-hit">Попадание!</span>`);
      }
    }
    refreshPlayerBoard(); updateStats();
    if(checkWin(playerShips)){endGame('ai');return;}
    setTimeout(aiTurn,500);
  } else {
    playerGrid[r][c]=2;
    addLog(`<span class="log-ai">Противник</span>: ${COLS[c]}${r+1} — <span class="log-miss">Промах</span>`);
    refreshPlayerBoard(); updateStats();
    isPlayerTurn=true;
    document.getElementById('turnIndicator').innerHTML='<span class="turn-player">▶ Ваш ход</span>';
  }
}
function refreshPlayerBoard(){
  for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++)refreshCell('playerBoard',playerGrid,r,c,true);
}

// --- Matrix Visualization ---
function updateMatrix(){
  const table=document.getElementById('matrixTable');
  let html='<tr><th></th>';
  for(let c=0;c<SIZE;c++)html+=`<th>${COLS[c]}</th>`;
  html+='</tr>';
  for(let r=0;r<SIZE;r++){
    html+=`<tr><th>${r+1}</th>`;
    for(let c=0;c<SIZE;c++){
      const v=aiVisible[r][c];
      const dv=v===4?3:v;
      html+=`<td class="val-${dv}">${dv}</td>`;
    }
    html+='</tr>';
  }
  table.innerHTML=html;
}

// --- Stats ---
function updateStats(){
  document.getElementById('statPlayerShots').textContent=stats.pShots;
  document.getElementById('statPlayerHits').textContent=stats.pHits;
  document.getElementById('statAiShots').textContent=stats.aShots;
  document.getElementById('statAiHits').textContent=stats.aHits;
  document.getElementById('statQuizScore').textContent=`${stats.qCorrect}/${stats.qAnswered}`;
}

// --- Phase ---
function updatePhase(){
  const badge=document.getElementById('phaseBadge');
  badge.className='phase-badge';
  if(phase==='placement'){badge.classList.add('phase-placement');badge.innerHTML='🚢 Расстановка кораблей';}
  else if(phase==='battle'){badge.classList.add('phase-battle');badge.innerHTML='⚔️ Идёт бой!';}
  else{badge.classList.add('phase-ended');badge.innerHTML='🏁 Бой завершён';}
}

// --- Log ---
function addLog(msg){
  const el=document.getElementById('logEntries');
  el.insertAdjacentHTML('afterbegin',`<div class="log-entry">${msg}</div>`);
  if(el.children.length>50)el.lastChild.remove();
}

// --- Strategy ---
const stratDescriptions={
  random:`<strong>Случайный алгоритм:</strong> Компьютер выбирает случайную клетку из ещё не обстрелянных. Аналог линейного поиска в случайном порядке по массиву. Сложность: O(n²) в худшем случае.`,
  checkerboard:`<strong>Шахматный алгоритм:</strong> Стреляет только в клетки с чётной суммой координат (r+c)%2==0. Основан на эвристике: корабли минимум 1 клетка, значит достаточно проверить половину поля. Аналог оптимизации перебора.`,
  hunter:`<strong>Охотник (BFS):</strong> При попадании добавляет соседние клетки в очередь и проверяет их. Это аналог алгоритма поиска в ширину (BFS). При промахе — переходит к случайному выстрелу. Наиболее эффективная стратегия.`,
  probability:`<strong>Решатель (плотность вероятности):</strong> Считает, сколькими способами оставшиеся корабли могут занять каждую клетку. В режиме поиска стреляет по parity-сетке с шагом крупнейшего корабля (4→3→2), после попадания добивает корабль по линии.`,
  custom:`<strong>Пользовательская стратегия:</strong> Противник выбирает клетку по вашей функции оценки: база стратегии, чётность, приоритет соседей после попадания, вес центра и случайность. Перед применением стратегия проходит тесты.`
};
document.querySelectorAll('.strategy-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    if(btn.dataset.strategy==='custom'){openCustomStrategyModal();return;}
    if(phase==='battle') maybeAskStrategyQuestion(btn.dataset.strategy);
    else switchStrategy(btn.dataset.strategy);
  });
});
function switchStrategy(s){
  aiStrategy=s;
  document.querySelectorAll('.strategy-btn').forEach(b=>b.classList.remove('active'));
  document.querySelector(`[data-strategy="${s}"]`).classList.add('active');
  document.getElementById('aiExplanation').innerHTML=stratDescriptions[s];
  addLog(`Стратегия противника: <strong>${s}</strong>`);
}

// --- Custom Strategy Builder ---
function loadCustomStrategyConfig(){
  const defaults={baseMode:'weighted',parity:'any',hitPriority:8,centerWeight:2,randomness:3};
  try{
    return {...defaults,...JSON.parse(localStorage.getItem('customAiStrategy')||'{}')};
  }catch{
    return defaults;
  }
}
function getCustomFormConfig(){
  return {
    baseMode:document.getElementById('customBaseMode').value,
    parity:document.getElementById('customParity').value,
    hitPriority:Number(document.getElementById('customHitPriority').value),
    centerWeight:Number(document.getElementById('customCenterWeight').value),
    randomness:Number(document.getElementById('customRandomness').value),
  };
}
function setCustomFormConfig(config){
  document.getElementById('customBaseMode').value=config.baseMode||'weighted';
  document.getElementById('customParity').value=config.parity||'any';
  document.getElementById('customHitPriority').value=String(config.hitPriority??8);
  document.getElementById('customCenterWeight').value=String(config.centerWeight??2);
  document.getElementById('customRandomness').value=String(config.randomness??3);
}
function updateCustomCodePreview(){
  const config=getCustomFormConfig();
  const setText=(id,value)=>{
    const el=document.getElementById(id);
    if(el)el.textContent=value;
  };
  setText('codeBaseMode',`'${config.baseMode}'`);
  setText('codeParity',`'${config.parity}'`);
  setText('codeHitPriority',String(config.hitPriority));
  setText('codeCenterWeight',String(config.centerWeight));
  setText('codeRandomness',String(config.randomness));
}
function validateCustomConfig(config){
  const errors=[];
  if(!['weighted','checker','hunter'].includes(config.baseMode))errors.push('Не выбрана база функции.');
  if(!['any','even','odd'].includes(config.parity))errors.push('Некорректная чётность клеток.');
  if(!Number.isFinite(config.hitPriority)||config.hitPriority<0||config.hitPriority>20)errors.push('Приоритет соседей должен быть от 0 до 20.');
  if(!Number.isFinite(config.centerWeight)||config.centerWeight<-10||config.centerWeight>10)errors.push('Вес центра должен быть от -10 до 10.');
  if(!Number.isFinite(config.randomness)||config.randomness<0||config.randomness>10)errors.push('Случайность должна быть от 0 до 10.');
  return errors;
}
function openCustomStrategyModal(){
  setCustomFormConfig(customStrategyConfig);
  updateCustomCodePreview();
  customStrategyTestPassed=false;
  document.getElementById('btnSaveCustomStrategy').disabled=true;
  document.getElementById('customTestStatus').textContent='Тесты ещё не запускались';
  document.getElementById('customTestResults').innerHTML='<div class="card-title">Результаты тестов</div><div class="custom-test-empty">Запустите тесты, чтобы проверить стратегию перед сохранением.</div>';
  document.getElementById('customStrategyModal').classList.remove('hidden');
}
function closeCustomStrategyModal(){
  document.getElementById('customStrategyModal').classList.add('hidden');
}
function availableCellsForGrid(grid,shotSet){
  let cells=[];
  for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++){
    if(!shotSet.has(r+','+c)&&grid[r][c]!==2&&grid[r][c]!==3&&grid[r][c]!==4)cells.push([r,c]);
  }
  return cells;
}
function adjacentHitTargets(grid,shotSet){
  const targets=[];
  for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++){
    if(grid[r][c]===3){
      [[r-1,c],[r+1,c],[r,c-1],[r,c+1]].forEach(([nr,nc])=>{
        if(nr>=0&&nr<SIZE&&nc>=0&&nc<SIZE&&!shotSet.has(nr+','+nc)&&grid[nr][nc]!==2&&grid[nr][nc]!==3&&grid[nr][nc]!==4){
          targets.push([nr,nc]);
        }
      });
    }
  }
  return targets;
}
function scoreCustomCell(r,c,grid,shotSet,config){
  let score=0;
  if(config.parity==='even'&&(r+c)%2!==0)score-=8;
  if(config.parity==='odd'&&(r+c)%2!==1)score-=8;
  if(config.baseMode==='checker'&&(r+c)%2===0)score+=4;
  const centerDistance=Math.abs(r-4.5)+Math.abs(c-4.5);
  score+=(9-centerDistance)*config.centerWeight;
  if(config.baseMode==='hunter'||config.hitPriority>0){
    const nearHit=adjacentHitTargets(grid,shotSet).some(([nr,nc])=>nr===r&&nc===c);
    if(nearHit)score+=config.hitPriority*5;
  }
  score+=Math.random()*config.randomness;
  return score;
}
function chooseCustomShot(grid=playerGrid,shotSet=aiShotSet,config=customStrategyConfig){
  const available=availableCellsForGrid(grid,shotSet);
  if(available.length===0)return [undefined,undefined];
  let best=available[0],bestScore=-Infinity;
  available.forEach(([r,c])=>{
    const score=scoreCustomCell(r,c,grid,shotSet,config);
    if(score>bestScore){bestScore=score;best=[r,c];}
  });
  return best;
}
function runCustomStrategyTests(){
  const config=getCustomFormConfig();
  const validationErrors=validateCustomConfig(config);
  const results=[];
  if(validationErrors.length){
    validationErrors.forEach(error=>results.push({ok:false,text:error}));
    renderCustomTestResults(results);
    return false;
  }
  const emptyGrid=makeGrid();
  const emptyShotSet=new Set();
  const first=chooseCustomShot(emptyGrid,emptyShotSet,config);
  results.push({ok:first[0]>=0&&first[1]>=0,text:'Функция возвращает координаты выстрела на пустом поле.'});
  results.push({ok:!emptyShotSet.has(first[0]+','+first[1]),text:'Функция не выбирает уже использованную клетку.'});

  const hitGrid=makeGrid();
  hitGrid[4][4]=3;
  const shotSet=new Set(['4,4']);
  const next=chooseCustomShot(hitGrid,shotSet,{...config,hitPriority:Math.max(config.hitPriority,8),baseMode:'hunter',randomness:0});
  const nearHit=Math.abs(next[0]-4)+Math.abs(next[1]-4)===1;
  results.push({ok:nearHit,text:'После попадания стратегия умеет выбирать соседнюю клетку.'});

  const fullShotSet=new Set();
  for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++)fullShotSet.add(r+','+c);
  const none=chooseCustomShot(makeGrid(),fullShotSet,config);
  results.push({ok:none[0]===undefined&&none[1]===undefined,text:'Если доступных клеток нет, функция корректно завершает работу.'});

  renderCustomTestResults(results);
  return results.every(r=>r.ok);
}
function renderCustomTestResults(results){
  const passed=results.every(r=>r.ok);
  customStrategyTestPassed=passed;
  document.getElementById('btnSaveCustomStrategy').disabled=!passed;
  document.getElementById('customTestStatus').textContent=passed?'Тесты пройдены успешно':'Есть ошибки в настройках';
  document.getElementById('customTestResults').innerHTML=
    '<div class="card-title">Результаты тестов</div>'+
    results.map(r=>`<div class="custom-test-line ${r.ok?'ok':'fail'}">${r.ok?'✓':'✕'} ${r.text}</div>`).join('');
}
function saveCustomStrategy(){
  if(!customStrategyTestPassed)return;
  const config=getCustomFormConfig();
  const errors=validateCustomConfig(config);
  if(errors.length){renderCustomTestResults(errors.map(text=>({ok:false,text})));return;}
  customStrategyConfig=config;
  localStorage.setItem('customAiStrategy',JSON.stringify(config));
  switchStrategy('custom');
  closeCustomStrategyModal();
  addLog('Пользовательская стратегия сохранена и включена.');
}

// --- Quiz ---
let questionPool=[];
function fetchQuestions(){
  const category=encodeURIComponent(selectedQuestionCategory);
  fetch(`/api/questions/?phase=all&count=100&category=${category}`)
    .then(r=>r.json()).then(d=>{questionPool=d.questions||[];})
    .catch(()=>{questionPool=getFallbackQuestions();});
}
function getQuestion(ph){
  let pool=questionPool.filter(q=>q.phase===ph||q.phase==='general');
  if(pool.length===0)pool=questionPool;
  if(pool.length===0)pool=getFallbackQuestions().filter(q=>q.category===selectedQuestionCategory);
  if(pool.length===0)pool=getFallbackQuestions();
  return pool[Math.floor(Math.random()*pool.length)];
}
function maybeAskQuestion(ph,callback){
  if(questionPool.length===0&&getFallbackQuestions().length===0){if(callback)callback();return;}
  if(Math.random()>0.5&&ph==='battle'){if(callback)callback();return;}
  showQuiz(getQuestion(ph),callback);
}
function maybeAskSecondShotQuestion(){
  if(questionPool.length===0&&getFallbackQuestions().length===0){passTurnToAi();return;}
  if(Math.random()>0.5){passTurnToAi();return;}
  showQuiz(getQuestion('battle'),correct=>{
    if(correct){
      bonusShotAvailable=true;
      isPlayerTurn=true;
      document.getElementById('turnIndicator').innerHTML='<span class="turn-player">▶ Бонусный выстрел</span>';
      addLog('Правильный ответ! Вы получаете шанс на второй выстрел.');
    } else {
      addLog('Ответ неверный — ход переходит компьютеру.');
      passTurnToAi();
    }
  });
}
function maybeAskStrategyQuestion(newStrategy){
  let q=questionPool.find(q=>q.phase==='strategy');
  if(!q)q=getQuestion('general');
  showQuiz(q,()=>switchStrategy(newStrategy));
}
function buildShuffledQuizOptions(q){
  const options=['A','B','C','D'].map(letter=>({
    sourceLetter:letter,
    text:q['option_'+letter.toLowerCase()],
    isCorrect:letter===q.correct_answer
  }));
  shuffle(options);
  return options.map((opt,i)=>({...opt,displayLetter:'ABCD'[i]}));
}
function showQuiz(q,callback){
  const modal=document.getElementById('quizModal');
  const badge=document.getElementById('quizBadge');
  badge.className='modal-badge';
  badge.classList.add(`badge-${q.difficulty}`);
  badge.textContent={easy:'лёгкий',medium:'средний',hard:'сложный'}[q.difficulty]||'';
  document.getElementById('quizQuestionText').textContent=q.text;
  const codeEl=document.getElementById('quizCodeBlock');
  if(q.code_snippet){codeEl.textContent=q.code_snippet;codeEl.classList.remove('hidden');}
  else codeEl.classList.add('hidden');
  const shuffled=buildShuffledQuizOptions(q);
  const optEl=document.getElementById('quizOptions');
  optEl.innerHTML='';
  shuffled.forEach(opt=>{
    const btn=document.createElement('button');
    btn.className='option-btn';
    btn.innerHTML=`<span class="option-letter">${opt.displayLetter}</span><span>${opt.text}</span>`;
    btn.addEventListener('click',()=>answerQuiz(opt.sourceLetter,q,callback,shuffled));
    optEl.appendChild(btn);
  });
  document.getElementById('quizExplanation').classList.remove('visible');
  document.getElementById('quizExplanation').textContent='';
  document.getElementById('quizContinue').classList.add('hidden');
  modal.classList.remove('hidden');
}
function answerQuiz(selectedLetter,q,callback,shuffled){
  stats.qAnswered++;
  const correct=selectedLetter===q.correct_answer;
  if(correct)stats.qCorrect++;
  updateStats();
  const btns=document.querySelectorAll('#quizOptions .option-btn');
  btns.forEach((btn,i)=>{
    btn.disabled=true;
    const opt=shuffled[i];
    if(opt.isCorrect)btn.classList.add('correct');
    else if(opt.sourceLetter===selectedLetter&&!correct)btn.classList.add('wrong');
  });
  const expEl=document.getElementById('quizExplanation');
  expEl.textContent=(correct?'✅ Правильно! ':'❌ Неверно. ')+q.explanation;
  expEl.classList.add('visible');
  const contBtn=document.getElementById('quizContinue');
  contBtn.classList.remove('hidden');
  contBtn.onclick=()=>{
    document.getElementById('quizModal').classList.add('hidden');
    if(callback)callback(correct);
  };
}

// --- End Game ---
function endGame(winner){
  phase='ended'; updatePhase();
  document.getElementById('turnIndicator').textContent='';
  const modal=document.getElementById('endModal');
  document.getElementById('endIcon').textContent=winner==='player'?'🎉':'😔';
  document.getElementById('endTitle').textContent=winner==='player'?'Победа!':'Поражение';
  document.getElementById('endTitle').style.color=winner==='player'?'var(--accent-green)':'var(--accent-red)';
  const acc=stats.pShots>0?Math.round(stats.pHits/stats.pShots*100):0;
  document.getElementById('endStats').innerHTML=`
    <div class="end-stat"><div class="value">${stats.pShots}</div><div class="label">Выстрелов</div></div>
    <div class="end-stat"><div class="value">${stats.pHits}</div><div class="label">Попаданий</div></div>
    <div class="end-stat"><div class="value">${acc}%</div><div class="label">Точность</div></div>
    <div class="end-stat"><div class="value">${stats.qCorrect}/${stats.qAnswered}</div><div class="label">Тест</div></div>`;
  // Postmortem
  const pm=document.getElementById('postmortemSection');
  const pmContent=document.getElementById('postmortemContent');
  const pmQ=questionPool.find(q=>q.phase==='postmortem');
  if(pmQ){
    pm.classList.remove('hidden');
    pmContent.innerHTML=`<p style="margin-bottom:10px">${pmQ.text}</p>
      ${pmQ.code_snippet?`<pre class="code-block">${pmQ.code_snippet}</pre>`:''}
      <div class="options-list" id="pmOptions"></div>
      <div class="explanation-box" id="pmExplanation"></div>`;
    const optEl=document.getElementById('pmOptions');
    const shuffled=buildShuffledQuizOptions(pmQ);
    shuffled.forEach(opt=>{
      const btn=document.createElement('button');
      btn.className='option-btn';
      btn.innerHTML=`<span class="option-letter">${opt.displayLetter}</span><span>${opt.text}</span>`;
      btn.addEventListener('click',()=>{
        stats.qAnswered++;
        const correct=opt.sourceLetter===pmQ.correct_answer;
        if(correct)stats.qCorrect++;
        updateStats();
        document.querySelectorAll('#pmOptions .option-btn').forEach((b,i)=>{
          b.disabled=true;
          const o=shuffled[i];
          if(o.isCorrect)b.classList.add('correct');
          else if(o.sourceLetter===opt.sourceLetter&&!correct)b.classList.add('wrong');
        });
        const e=document.getElementById('pmExplanation');
        e.textContent=(correct?'✅ ':'❌ ')+pmQ.explanation;
        e.classList.add('visible');
        saveSession(winner);
      });
      optEl.appendChild(btn);
    });
  } else pm.classList.add('hidden');
  modal.classList.remove('hidden');
  if(!pmQ)saveSession(winner);
}
function saveSession(winner){
  fetch('/api/save-session/',{method:'POST',headers:{'Content-Type':'application/json'},
    credentials:'same-origin',
    body:JSON.stringify({ai_strategy:aiStrategy,question_category:selectedQuestionCategory,
      player_shots:stats.pShots,ai_shots:stats.aShots,
      player_hits:stats.pHits,ai_hits:stats.aHits,winner,
      questions_answered:stats.qAnswered,questions_correct:stats.qCorrect})
  }).catch(()=>{});
}

// --- Fallback questions ---
function getFallbackQuestions(){return[
  {id:0,text:'Как обратиться к элементу board в строке 3, столбце 5?',code_snippet:'board = [[0]*10 for _ in range(10)]',
   option_a:'board[3][5]',option_b:'board[5][3]',option_c:'board(3,5)',option_d:'board{3}{5}',
   correct_answer:'A',explanation:'В Python: board[строка][столбец].',difficulty:'easy',phase:'general',category:'Массивы'},
  {id:1,text:'Сколько раз выполнится range(10)?',code_snippet:'for i in range(10): pass',
   option_a:'9',option_b:'10',option_c:'11',option_d:'1',
   correct_answer:'B',explanation:'range(10) даёт 0..9, т.е. 10 итераций.',difficulty:'easy',phase:'general',category:'Циклы'},
  {id:2,text:'Какое условие проверяет попадание?',code_snippet:'# 0-пусто,1-корабль,2-промах,3-попадание',
   option_a:'board[r][c]==0',option_b:'board[r][c]==1',option_c:'board[r][c]==2',option_d:'board[r][c]!=0',
   correct_answer:'B',explanation:'1 = корабль, значит ==1 — попадание.',difficulty:'easy',phase:'battle',category:'Условия'},
  {id:3,text:'Какой оператор «И» в Python?',code_snippet:'',
   option_a:'&&',option_b:'AND',option_c:'and',option_d:'&',
   correct_answer:'C',explanation:'Логическое «И» — ключевое слово and.',difficulty:'easy',phase:'general',category:'Условия'},
  {id:4,text:'Зачем функцию делают отдельным блоком кода?',code_snippet:'function updateStats(){ ... }',
   option_a:'Чтобы повторно использовать действие',option_b:'Чтобы удалить переменные',option_c:'Чтобы остановить цикл',option_d:'Чтобы скрыть массив',
   correct_answer:'A',explanation:'Функция объединяет действие и позволяет вызывать его в нужных местах программы.',difficulty:'easy',phase:'general',category:'Функции'},
  {id:5,text:'Что делает алгоритм "Охотник" после попадания?',code_snippet:'queue.push([r-1,c], [r+1,c], [r,c-1], [r,c+1])',
   option_a:'Стреляет только в углы',option_b:'Проверяет соседние клетки',option_c:'Начинает игру заново',option_d:'Очищает поле',
   correct_answer:'B',explanation:'После попадания выгодно проверить клетки рядом, потому что корабль продолжается по соседству.',difficulty:'easy',phase:'battle',category:'Алгоритмы'},
  {id:6,text:'Что означает один проход цикла по строкам и столбцам поля?',code_snippet:'for r in range(10):\\n    for c in range(10):',
   option_a:'Перебор всех клеток поля',option_b:'Создание одного корабля',option_c:'Поворот корабля',option_d:'Проверка только углов',
   correct_answer:'A',explanation:'Вложенные циклы позволяют пройти по каждой строке и каждому столбцу матрицы.',difficulty:'easy',phase:'general',category:'Циклы'},
  {id:7,text:'Что хранит двумерный массив в Морском бое?',code_snippet:'grid[r][c] = 3',
   option_a:'Только имя игрока',option_b:'Состояние каждой клетки',option_c:'Цвет кнопок',option_d:'Пароль пользователя',
   correct_answer:'B',explanation:'Двумерный массив хранит состояние поля: пусто, корабль, промах, попадание или потоплено.',difficulty:'easy',phase:'general',category:'Массивы'},
  {id:8,text:'Что показывает score в пользовательской стратегии?',code_snippet:'if(score > bestScore) best = [r,c]',
   option_a:'Размер корабля',option_b:'Оценку выгодности клетки',option_c:'Количество игроков',option_d:'Номер вопроса',
   correct_answer:'B',explanation:'score — это числовая оценка клетки. Противник выбирает клетку с максимальным score.',difficulty:'easy',phase:'strategy',category:'Алгоритмы'},
  {id:9,text:'Для чего нужна проверка границ поля?',code_snippet:'if(nr>=0 && nr<SIZE && nc>=0 && nc<SIZE)',
   option_a:'Чтобы не выйти за массив',option_b:'Чтобы изменить тему',option_c:'Чтобы добавить очки',option_d:'Чтобы скрыть вопрос',
   correct_answer:'A',explanation:'Проверка границ не позволяет обратиться к несуществующей строке или колонке массива.',difficulty:'easy',phase:'placement',category:'Условия'},
];}

// --- Utility ---
function shuffle(a){for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}}

// --- Event Listeners ---
document.getElementById('btnAutoPlace').addEventListener('click',autoPlace);
document.getElementById('btnResetPlacement').addEventListener('click',resetPlacement);
document.getElementById('btnStartBattle').addEventListener('click',()=>{
  maybeAskQuestion('placement',startBattle);
});
document.getElementById('btnNewGame').addEventListener('click',()=>{
  document.getElementById('endModal').classList.add('hidden');
  init();
});
document.getElementById('endNewGame').addEventListener('click',()=>{
  document.getElementById('endModal').classList.add('hidden');
  init();
});
document.getElementById('btnCancelCustomStrategy').addEventListener('click',closeCustomStrategyModal);
document.getElementById('btnRunCustomTests').addEventListener('click',runCustomStrategyTests);
document.getElementById('btnSaveCustomStrategy').addEventListener('click',saveCustomStrategy);
['customBaseMode','customParity','customHitPriority','customCenterWeight','customRandomness'].forEach(id=>{
  const field=document.getElementById(id);
  const onCustomFieldChange=()=>{
    updateCustomCodePreview();
    customStrategyTestPassed=false;
    document.getElementById('btnSaveCustomStrategy').disabled=true;
    document.getElementById('customTestStatus').textContent='Параметры изменены — запустите тесты повторно';
  };
  field.addEventListener('input',onCustomFieldChange);
  field.addEventListener('change',onCustomFieldChange);
});

// --- Start ---
init();
// venv\Scripts\python.exe manage.py runserver
// http://127.0.0.1:8000/


