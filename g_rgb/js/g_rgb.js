// 필요한 요소들 가져오기
const userBtn = document.getElementById('user-btn');
const rInput = document.getElementById('r-input');
const gInput = document.getElementById('g-input');
const bInput = document.getElementById('b-input');

// 페이지 번호 로컬스토리지에 저장
localStorage.setItem('key', 4);

// 본인 게임 이름 적기
const gameDescription = "RGB 맞추기";

// 헤더 게임 설명 넣는 함수
getGuide(gameDescription);

// 정답 설정
let targetColor = { r: 34, g: 197, b: 94 };
const threshold = 10;

// 색상 업데이트 및 성공 체크 함수
function updateGame() {
    // 값이 비어있으면 0으로 처리
    const r = parseInt(rInput.value) || 0;
    const g = parseInt(gInput.value) || 0;
    const b = parseInt(bInput.value) || 0;

    // 사용자 버튼 색상 실시간 반영
    userBtn.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

    // 정답과의 거리 계산
    const diff = Math.abs(targetColor.r - r) + Math.abs(targetColor.g - g) + Math.abs(targetColor.b - b);

    if (diff <= threshold) {
        // 성공 조건 만족 시
        userBtn.innerText = "수업한다"
        userBtn.classList.add('success-active');
        userBtn.onclick = nextStage; // 클릭 시 다음 스테이지 함수 실행
    } else {
        // 조건 불만족 시 다시 초기화
        userBtn.innerText = "수업 안 함"
        userBtn.classList.remove('success-active');
        userBtn.onclick = null;
    }
}

// 다음 스테이지로 넘어가는 함수
function nextStage() {
    throwLocalStorage(stageNum);
    // alert("축하합니다! 스테이지 클리어!");
    // 여기에 다음 정답 생성 및 스테이지 카운트 올리는 로직 추가
}

// 입력값 검증 함수 (0~255)
function validateRGB(e) {
    let value = e.target.value;

    // 빈 문자열일 때는 0으로 처리하지 않고 비워둠
    if (value === "") return updateGame();

    // ex. 045 입력 방지, 바로 숫자로 바꿔주기 
    let numValue = Number(value);

    // 255 보다 큰 값 입력 시 자동으로 255
    if (numValue > 255) {
        numValue = 255;
    } else if (numValue < 0 || isNaN(numValue)) {
        numValue = 0;
    }
    e.target.value = numValue;
    updateGame();
}

// 입력창에 이벤트 리스너 연결
[rInput, gInput, bInput].forEach(input => {
    input.addEventListener('keydown', (e) => {
        // e, +, -, . 입력을 막음
        if (['e', 'E', '+', '-', '.'].includes(e.key)) {
            e.preventDefault();
        }
    });

    input.addEventListener('input', validateRGB);
});

// 처음으로 돌아가는 버튼 눌렀을 때 함수 호출


// 초기 실행
updateGame();