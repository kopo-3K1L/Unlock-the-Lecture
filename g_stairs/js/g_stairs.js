localStorage.setItem('key', 12);
getGuide('교수님의 점심을 지켜라');

const GAME_W = 600;
const STAIR_W = 143;
const STEP_X = 85;
const STEP_Y = 72;
const CHAR_W = 88;
const CHAR_H = 88;
const CHAR_SCREEN_Y = 370; // 계단 top 기준 Y
const STAIR_COUNT = 10;
const GOAL = 30;
const TIME_LIMIT = 15;
const MIN_X = 30; // 계단 최소 왼쪽 경계
const MAX_X = GAME_W - STAIR_W - 30; // 계단 최대 오른쪽 경계
const containerEl = document.getElementById('container');
const gameArea = document.getElementById('game-area');
const charEl = document.getElementById('character');
const timerEl = document.getElementById('timer');
const scoreEl = document.getElementById('score');
const messageEl = document.getElementById('message');
const startBtn = document.getElementById('start-btn');
const failBtns = document.getElementById('fail-btns');
const retryBtn = document.getElementById('retry-btn');
const failBtn = document.getElementById('fail-btn');
const nextBtn = document.getElementById('next-btn');

let stairs = [];
let score = 0;
let timeLeft = TIME_LIMIT;
let gameRunning = false;
let timerId = null;

function createStairEl(x, screenY) {
  const el = document.createElement('div');
  el.classList.add('stair');
  el.style.left = x + 'px';
  el.style.top = screenY + 'px';
  gameArea.appendChild(el);
  return el;
}

function nextDir(x) {
  if (x <= MIN_X + STEP_X) return 'right';
  if (x >= MAX_X - STEP_X) return 'left';
  return Math.random() < 0.5 ? 'left' : 'right';
}

function initStairs() {
  stairs.forEach((s) => s.el.remove());
  stairs = [];

  const startX = GAME_W / 2 - STAIR_W / 2;
  for (let i = 0; i < STAIR_COUNT; i++) {
    let x, dir;

    if (i === 0) {
      x = startX;
      dir = null;
    } else {
      const prev = stairs[i - 1];
      dir = nextDir(prev.x);
      x = prev.x + (dir === 'right' ? STEP_X : -STEP_X);
    }

    const screenY = CHAR_SCREEN_Y - i * STEP_Y;
    const el = createStairEl(x, screenY);

    stairs.push({ x, screenY, dir, el });
  }

  stairs[0].el.classList.add('current');

  updateCharPos();
}

function updateCharPos() {
  const currentStair = stairs[0];
  charEl.style.left = currentStair.x + STAIR_W / 2 - CHAR_W / 2 + 'px';
  charEl.style.top = CHAR_SCREEN_Y - CHAR_H + 'px';
}

function move(dir) {
  if (!gameRunning) return;

  const nextStair = stairs[1];
  if (!nextStair) return;

  if (nextStair.dir === dir) {
    stairs[0].el.classList.remove('current');
    stairs[0].el.remove();
    stairs.shift();

    stairs.forEach((s) => {
      s.screenY += STEP_Y;
      s.el.style.top = s.screenY + 'px';
    });

    const prev = stairs[stairs.length - 1];
    const newDir = nextDir(prev.x);
    const newX = prev.x + (newDir === 'right' ? STEP_X : -STEP_X);
    const newScreenY = prev.screenY - STEP_Y;
    const newEl = createStairEl(newX, newScreenY);
    stairs.push({ x: newX, screenY: newScreenY, dir: newDir, el: newEl });

    stairs[0].el.classList.add('current');

    updateCharPos();

    score++;
    scoreEl.textContent = `계단: ${score} / ${GOAL}`;

    const bgY = 100 - (score / GOAL) * 100;
    containerEl.style.backgroundPositionY = bgY + '%';

    if (score >= GOAL) endGame(true);
  } else {
    endGame(false);
  }
}

function onSuccess() {
  throwLocalStorage(12);
}

function endGame(success) {
  gameRunning = false;
  clearInterval(timerId);

  if (success) {
    startBtn.classList.add('hidden');
    failBtns.classList.add('hidden');
    nextBtn.classList.remove('hidden');
  } else {
    startBtn.classList.add('hidden');
    failBtns.classList.remove('hidden');
    nextBtn.classList.add('hidden');
  }

  messageEl.classList.remove('hidden');
}

function startGame() {
  clearInterval(timerId);

  score = 0;
  timeLeft = TIME_LIMIT;
  gameRunning = true;

  scoreEl.textContent = `계단: 0 / ${GOAL}`;
  containerEl.style.backgroundPositionY = '100%';
  timerEl.textContent = timeLeft;
  timerEl.classList.remove('danger');
  messageEl.classList.add('hidden');
  startBtn.classList.add('hidden');
  nextBtn.classList.add('hidden');
  failBtns.classList.add('hidden');

  initStairs();

  timerId = setInterval(() => {
    if (!gameRunning) return;

    timeLeft--;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 10) timerEl.classList.add('danger');
    if (timeLeft <= 0) endGame(false);
  }, 1000);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    move('left');
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    move('right');
  }
});

scoreEl.textContent = `계단: 0 / ${GOAL}`;
timerEl.textContent = TIME_LIMIT;

startBtn.addEventListener('click', startGame);
retryBtn.addEventListener('click', startGame);
nextBtn.addEventListener('click', onSuccess);
