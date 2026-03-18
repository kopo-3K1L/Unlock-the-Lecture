const container = document.getElementById('container');
const guide = document.getElementById('dark-guide');

// 버튼 총 개수
const TOTAL_BTN_COUNT = 70;
let zIndexCounter = 100;

// 텍스트 리스트 (진짜 1개 + 가짜들)
// isReal 속성으로 진짜 골라내기
const texts = [
  { text: '수업한다', isReal: true },
  { text: '수언한다', isReal: false },
  { text: '수업할까', isReal: false },
  { text: '수엄하기', isReal: false },
  { text: '수업하게', isReal: false },
  { text: '수업하쟈', isReal: false },
  { text: '수업함다', isReal: false },
  { text: '수업안한다', isReal: false },
  { text: '수업휴강', isReal: false }
];

// 게임 시작 함수
function initGame() {
  // 배치 영역 설정
  const gameWidth = container.offsetWidth || 1200;
  const gameHeight = container.offsetHeight || 800;

  // 게임 설명 구역
  const offsetTop = guide.offsetHeight;

  // 버튼 데이터 생성
  // (진짜 1개 + 나머지는 랜덤 가짜)
  let btnDataList = [];

  // 수업한다 버튼 하나 추가
  btnDataList.push(texts[0]);

  // 가짜 버튼들 추가
  for (let i = 1; i < TOTAL_BTN_COUNT; i++) {
    // 텍스트 리스트 length를 이용해서 texts 중 하나 꺼내기
    // + 1 은 진짜 texts[0] 을 안넣기 위함
    const randomFake = texts[Math.floor(Math.random() * (texts.length - 1)) + 1];
    btnDataList.push(randomFake);
  }

  // Fisher-Yates 셔플로 순서 섞기
  // sort는 편향 발생? -> 찾아보기
  for (let i = btnDataList.length - 1; i > 0; i--) {
    // 0부터 i까지의 정수를 잘 반환하기 위함 (+ 1)
    const j = Math.floor(Math.random() * (i + 1));
    [btnDataList[i], btnDataList[j]] = [btnDataList[j], btnDataList[i]];
  }

  // 그리드 기반 배치
  const cols = 6;
  const rows = 7;

  // 그리드 셀 크기
  const cellWidth = gameWidth / cols;
  const cellHeight = (gameHeight - offsetTop) / rows;

  // 하나씩 꺼내서 실제 화면 좌표로 변환
  btnDataList.forEach((data, index) => {
    // 현재 row와 col을 계산
    const r = Math.floor(index / cols) % rows;
    const c = index % cols;

    // 셀 중앙 좌표 + 20px 으로 불규칙
    // 너무 겹치는 거 방지
    const posX = (c * cellWidth) + (cellWidth / 2) + (Math.random() * 40 - 20);
    const posY = offsetTop + (r * cellHeight) + (cellHeight / 2) + (Math.random() * 40 - 20);
    
    // 버튼 삐딱하게 (겹치는 버튼 살짝 보이게)
    const randomRotate = Math.random() * 30 - 20;

    // 버튼 만들기
    createButton(data, { x: posX, y: posY, rotate: randomRotate });
  });

  initDarkness(); // 암흑 효과 초기화
}

// 버튼 생성 함수
function createButton(data, pos) {
  const btn = document.createElement('button');
  
  // 클래스 부여
  btn.className = 'green-btn'; 
  
  // 진짜 버튼인 경우에만 추가 클래스 지정
  if (data.isReal) {
    btn.classList.add('real-target');
  }
  
  btn.innerText = data.text;
  btn.dataset.isReal = data.isReal;

  btn.style.position = 'absolute';
  btn.style.left = `${pos.x}px`;
  btn.style.top = `${pos.y}px`;

  // 배치 시 랜덤 회전 적용
  btn.style.setProperty('--rotate', `${pos.rotate}deg`);

  makeDraggable(btn);
  container.appendChild(btn);
}

// 암흑 효과 (마우스 광원)
function initDarkness() {
  // 공간 만들기
  const overlay = document.createElement('div');
  overlay.id = 'dark-overlay';
  container.appendChild(overlay);

  // getBoundingClientRect: 마우스의 절대 좌표를 container 안의 상대 좌표로 바꿈을 위함
  const updateLight = (e) => {
    const x = e.clientX - container.getBoundingClientRect().left;
    const y = e.clientY - container.getBoundingClientRect().top;

    // css에 값 전달
    container.style.setProperty('--cursor-x', `${x}px`);
    container.style.setProperty('--cursor-y', `${y}px`);
  };

  // 마우스 추적
  window.addEventListener('mousemove', updateLight);
}

// -------- g_drag와 유사 --------
// 드래그 기능 부여
function makeDraggable(el) {
  let isDragging = false;
  let startX, startY, initialLeft, initialTop;

  // 마우스 클릭 시작 (드래그 준비)
  el.addEventListener('mousedown', (e) => {
    isDragging = true;

    // 클릭한 요소가 다른 요소보다 위로
    el.style.zIndex = zIndexCounter++;
    el.style.transition = 'none';
    el.style.cursor = 'grabbing';

    // 마우스의 시작 위치
    startX = e.clientX;
    startY = e.clientY;

    // 버튼의 시작 위치 (float는 px 제거용)
    initialLeft = parseFloat(el.style.left);
    initialTop = parseFloat(el.style.top);
  });

  // 드래그 시작
  window.addEventListener('mousemove', (e) => {
    // 클릭 중인가
    if (!isDragging) return;

    // 마우스가 이동한 거리
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    // 버튼의 시작 위치 + 이동한 거리
    let newLeft = initialLeft + dx;
    let newTop = initialTop + dy;

    // 영역 제한 (버튼의 중간 값)
    const halfW = el.offsetWidth / 2;
    const halfH = el.offsetHeight / 2;
    const offsetTop = guide.offsetHeight;

    // 좌우 검사
    newLeft = Math.max(halfW, Math.min(newLeft, container.offsetWidth - halfW));

    // 상하 검사
    newTop = Math.max(offsetTop + halfH, Math.min(newTop, container.offsetHeight - halfH));

    // px를 문자열로 받기 때문에 px 추가
    el.style.left = `${newLeft}px`;
    el.style.top = `${newTop}px`;
  });

  // 드래그 종료
  window.addEventListener('mouseup', (e) => {
    // 클릭 중인가
    if (!isDragging) return;
    
    // 진짜면 cursor의 모양을 바꿈! 
    el.style.cursor = el.dataset.isReal === 'true' ? 'pointer' : 'grab';
    
    // 이동 거리가 거의 없을 때, 클릭으로 간주
    const dx = Math.abs(e.clientX - startX);
    const dy = Math.abs(e.clientY - startY);

    // 클릭 판정
    if (dx < 5 && dy < 5) {
        if (el.dataset.isReal === 'true') {
            alert('스테이지 클리어!');
        } else {
            alert('땡!');
        }
    }
    isDragging = false;
  });
}

// 게임 실행
initGame();