const container = document.getElementById('container');
const mazeArea = document.getElementById('maze-area');
const messageEl = document.getElementById('message');
const startBtn = document.getElementById('start-btn');
const failBtns = document.getElementById('fail-btns');
const retryBtn = document.getElementById('retry-btn');
const failBtn = document.getElementById('fail-btn');
const nextBtn = document.getElementById('next-btn');
const cursorEl = document.getElementById('maze-cursor');

let gameRunning = false;
let gameEnded = false;
let obstacles = [];
let animFrameId = null;

let mouseX = 0;
let mouseY = 0;
let mouseInsideMaze = false;

const CURSOR_RADIUS = 7;

const MAZE_LAYOUT = [
  { type: 'wall', x: 0, y: 0, w: 100, h: 100 },

  { type: 'path', x: 5, y: 8, w: 85, h: 7 },
  { type: 'path', x: 82, y: 8, w: 8, h: 39 },

  { type: 'path', x: 55, y: 40, w: 35, h: 7 },
  { type: 'path', x: 55, y: 40, w: 7, h: 23 },
  { type: 'path', x: 28, y: 56, w: 34, h: 7 },
  { type: 'path', x: 28, y: 40, w: 7, h: 23 },
  { type: 'path', x: 5, y: 40, w: 30, h: 7 },

  { type: 'path', x: 5, y: 40, w: 8, h: 35 },
  { type: 'path', x: 5, y: 68, w: 85, h: 7 },

  { type: 'start', x: 6, y: 9, w: 5, h: 5 },
  { type: 'end', x: 83, y: 69, w: 5, h: 5 },

  { type: 'obstacle', x: 84, y: 20, w: 4, h: 5, range: 12, speed: 0.18 },
  { type: 'obstacle', x: 7, y: 52, w: 4, h: 5, range: 10, speed: 0.15 },
];

function buildMaze() {
  mazeArea.innerHTML = '';
  obstacles = [];

  MAZE_LAYOUT.forEach((item) => {
    const el = document.createElement('div');
    el.style.left = item.x + '%';
    el.style.top = item.y + '%';
    el.style.width = item.w + '%';
    el.style.height = item.h + '%';

    if (item.type === 'wall') {
      el.classList.add('wall');
      el.addEventListener('mouseenter', () => {
        if (gameRunning && !gameEnded) endGame(false);
      });
    }

    if (item.type === 'path') {
      el.classList.add('path');
    }

    if (item.type === 'obstacle') {
      el.classList.add('obstacle');
      obstacles.push({
        el,
        startY: item.y,
        range: item.range,
        speed: item.speed,
        dir: 1,
        cur: 0,
      });
      el.addEventListener('mouseenter', () => {
        if (gameRunning && !gameEnded) endGame(false);
      });
    }

    if (item.type === 'start') {
      el.id = 'start-point';
      el.classList.add('waiting');
      el.addEventListener('mouseenter', () => {
        if (!gameRunning && !gameEnded) {
          gameRunning = true;
          el.classList.remove('waiting');
        }
      });
    }

    if (item.type === 'end') {
      el.id = 'end-point';
      el.addEventListener('mouseenter', () => {
        if (gameRunning && !gameEnded) endGame(true);
      });
    }

    mazeArea.appendChild(el);
  });
}

function isMouseCollidingWithElement(el) {
  const rect = el.getBoundingClientRect();
  return (
    mouseX + CURSOR_RADIUS >= rect.left &&
    mouseX - CURSOR_RADIUS <= rect.right &&
    mouseY + CURSOR_RADIUS >= rect.top &&
    mouseY - CURSOR_RADIUS <= rect.bottom
  );
}

// 장애물 상하 왕복 애니메이션
function animateObstacles() {
  if (gameEnded) return;

  for (const obs of obstacles) {
    obs.cur += obs.speed * obs.dir;

    if (obs.cur >= obs.range) {
      obs.cur = obs.range;
      obs.dir = -1;
    } else if (obs.cur <= 0) {
      obs.cur = 0;
      obs.dir = 1;
    }

    obs.el.style.top = obs.startY + obs.cur + '%';

    if (gameRunning && mouseInsideMaze && isMouseCollidingWithElement(obs.el)) {
      endGame(false);
      return;
    }
  }

  animFrameId = requestAnimationFrame(animateObstacles);
}

mazeArea.addEventListener('mousemove', (e) => {
  const containerRect = container.getBoundingClientRect();
  mouseX = e.clientX;
  mouseY = e.clientY;
  mouseInsideMaze = true;
  cursorEl.style.left = e.clientX - containerRect.left + 'px';
  cursorEl.style.top = e.clientY - containerRect.top + 'px';
  cursorEl.style.display = 'block';

  if (!gameRunning || gameEnded) return;

  // 원이 닿는가
  const edgePoints = [
    [mouseX + CURSOR_RADIUS, mouseY],
    [mouseX - CURSOR_RADIUS, mouseY],
    [mouseX, mouseY + CURSOR_RADIUS],
    [mouseX, mouseY - CURSOR_RADIUS],
  ];

  for (const [px, py] of edgePoints) {
    const el = document.elementFromPoint(px, py);
    if (
      el &&
      (el.classList.contains('wall') || el.classList.contains('obstacle'))
    ) {
      endGame(false);
      return;
    }
  }
});

mazeArea.addEventListener('mouseenter', (e) => {
  const containerRect = container.getBoundingClientRect();
  mouseX = e.clientX;
  mouseY = e.clientY;
  mouseInsideMaze = true;
  cursorEl.style.left = e.clientX - containerRect.left + 'px';
  cursorEl.style.top = e.clientY - containerRect.top + 'px';
  cursorEl.style.display = 'block';
});

mazeArea.addEventListener('mouseleave', () => {
  mouseInsideMaze = false;
  cursorEl.style.display = 'none';
  if (gameRunning && !gameEnded) endGame(false);
});

// 성공/실패 처리 및 버튼 표시
function endGame(success) {
  if (gameEnded) return;

  gameEnded = true;
  gameRunning = false;
  cancelAnimationFrame(animFrameId);
  cursorEl.style.display = 'none';

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
  cancelAnimationFrame(animFrameId);
  gameRunning = false;
  gameEnded = false;
  mouseInsideMaze = false;

  startBtn.classList.add('hidden');
  failBtns.classList.add('hidden');
  nextBtn.classList.add('hidden');
  messageEl.classList.add('hidden');
  cursorEl.style.display = 'none';

  buildMaze();
  animateObstacles();
}

function onSuccess() {
  // 다음 스테이지 이동 로직 추가 예정
}

function onFail() {
  // 실패 시 어쩌지
}

startBtn.addEventListener('click', startGame);
retryBtn.addEventListener('click', startGame);
failBtn.addEventListener('click', onFail);
nextBtn.addEventListener('click', onSuccess);
