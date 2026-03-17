// 필요한 요소들 가져오기
const userBtn = document.getElementById('user-btn');
const rInput = document.getElementById('r-input');
const gInput = document.getElementById('g-input');
const bInput = document.getElementById('b-input');
const uButton = document.getElementById('user-btn');
// const container = document.getElementById('scroll-')
// container.innerHTML = `<p id="scroll-guide">스크롤을 내려 '진짜 수업하기 버튼'을 찾아주세요</p>` 

// 일단 가상 정답
let targetColor = { r: 159, g: 221, b: 34 }; 
const threshold = 10; // 이 수치보다 작아야 성공 (난이도 조절)

// 색상 업데이트 및 성공 체크 함수
function updateGame() {
    const r = parseInt(rInput.value) || 0;
    const g = parseInt(gInput.value) || 0;
    const b = parseInt(bInput.value) || 0;

    // 사용자 버튼 색상 실시간 반영
    userBtn.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

    // 정답과의 거리 계산
    const diff = Math.abs(targetColor.r - r) + Math.abs(targetColor.g - g) + Math.abs(targetColor.b - b);

    if (diff <= threshold) {
        // 성공 조건 만족 시
        userBtn.classList.add('success-active');
        userBtn.onclick = nextStage; // 클릭 시 다음 스테이지 함수 실행
    } else {
        // 조건 불만족 시 다시 초기화
        userBtn.classList.remove('success-active');
        userBtn.onclick = null;
    }
}

// 다음 스테이지로 넘어가는 함수
function nextStage() {
    alert("축하합니다! 스테이지 클리어!");
    // 여기에 다음 정답 생성 및 스테이지 카운트 올리는 로직 추가
}

function validateRGB(e) {
    let value = parseInt(e.target.value);

    // 1. 255보다 크면 255로 고정
    if (value > 255) {
        e.target.value = 255;
    } 
    // 2. 0보다 작거나 음수를 입력하면 0으로 고정
    else if (value < 0) {
        e.target.value = 0;
    }
    
    // 이후 기존에 만든 색상 업데이트 함수 호출
    updateGame(); 
}

// 입력창에 이벤트 리스너 연결
[rInput, gInput, bInput].forEach(input => {
    input.addEventListener('input', validateRGB);
});