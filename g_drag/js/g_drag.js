const container = document.getElementById('container');
const guide = document.getElementById('rgb-guide');

// 방해 요소 개수
const RED_BTN_COUNT = 124; 
let zIndexCounter = 100;

// 게임 초기화 및 버튼 뿌리기
function initGame() {
    const gameWidth = 1200;
    const gameHeight = 800;
    const offsetTop = guide.offsetHeight; 

    // 플레이 가능 영역 높이 (1200-가이드바)
    const playableHeight = gameHeight - offsetTop;

    // 행과 열 개수 지정
    const cols = 5;
    const rows = 5;

    // 지정된 행과 열 개수에 따른 그리드 하나의 wd, ht
    const cellWidth = gameWidth / cols;
    const cellHeight = playableHeight / rows;
    
    // 그리드 기반 좌표 생성 (25개)
    let slots = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            slots.push({
                x: (c * cellWidth) + (cellWidth / 2),
                y: offsetTop + (r * cellHeight) + (cellHeight / 2)
            });
        }
    }
    
    // 무작위 좌표 셔플
    slots.sort(() => Math.random() - 0.5);

    // 수업하기 좌표 지정 (무작위로 셔플된 요소 중 첫 번째 사용)
    const targetPos = slots[0];

    // 수업하기 좌표에 수업하기 버튼 생성
    createButton('green-button', '수업하기', targetPos);

    // 수업 안 함 버튼 생성
    for (let i = 0; i < RED_BTN_COUNT; i++) {
        let currentPos;

        // red-button 골고루 분배
        currentPos = slots[i % slots.length];
        createButton('red-button', '수업 안 함', currentPos);
    }
}

// 버튼 생성 후 화면 배치
function createButton(type, text, pos) {
    const btn = document.createElement('button');
    if (type === 'green-button') 
      btn.id = 'green-button';
    else 
      btn.className = 'red-button';
    
    btn.innerText = text;
    
    // 절대 좌표 for 중앙 정렬
    btn.style.position = 'absolute';
    btn.style.left = `${pos.x}px`;
    btn.style.top = `${pos.y}px`;
    
    // 정중앙으로 보정
    btn.style.transform = 'translate(-50%, -50%)'; 
    btn.style.margin = '0';

    makeDraggable(btn);
    container.appendChild(btn);
}

// 드래그 기능 부여
function makeDraggable(el) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    // 마우스 클릭 시작 (드래그 준비)
    el.addEventListener('mousedown', (e) => {
        isDragging = true;

        // 클릭한 요소가 다른 요소보다 위로
        el.style.zIndex = zIndexCounter++;

        el.style.transform = 'translate(-50%, -50%))';
        el.style.transition = 'none'; 

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
        const offsetTop = guide.offsetHeight || 55;

        // 좌우 검사
        // Math.min(newLeft, 1200 - halfW): 오른쪽으로 가다가 1150이 커지면 1150으로 고정
        // Math.max(halfW, Math.min(newLeft, 1200 - halfW)): 왼쪽으로 가다가 50보다 작아지면 50으로 고정
        newLeft = Math.max(halfW, Math.min(newLeft, 1200 - halfW));

        // 상하 검사
        newTop = Math.max(offsetTop + halfH, Math.min(newTop, 800 - halfH));

        // px를 문자열로 받기 때문에 px 추가
        el.style.left = `${newLeft}px`;
        el.style.top = `${newTop}px`;
    });

    // 드래그 종료
    window.addEventListener('mouseup', (e) => {
        // 클릭 중인가
        if (!isDragging) return;
        
        // 버튼 크기 복구
        el.style.transform = 'translate(-50%, -50%)';
        el.style.transition = 'transform 0.2s';

        // 이동 거리가 거의 없을 때, 클릭으로 간주 (수업 안 함 클릭 함수 추가했을 때, 추가 로직 필요)
        const dx = Math.abs(e.clientX - startX);
        const dy = Math.abs(e.clientY - startY);

        // 클릭 판정
        if (dx < 5 && dy < 5 && el.id === 'green-button') {
            alert('스테이지 클리어');
        }
        isDragging = false;
    });
}

// 게임 실행
initGame();