let startTime;
let timerId;
let isRunning = false;
let isFinished = false;

// 페이지 번호 로컬스토리지에 저장
localStorage.setItem("key", 3);

// 본인 게임 이름 적기
const gameDescription = "인간 타이머 그 잡채";

// 헤더 게임 설명 넣는 함수
getGuide(gameDescription);

function handleTimer() {
  const btn = document.getElementById("action-btn");
  const display = document.getElementById("timer-display");
  const status = document.getElementById("status-text");
  const stopwatch = document.getElementById("stopwatch");
  const warning = document.getElementById("warning-message");
  const containerImage = document.getElementById("container");
  const backgroundImage = document.getElementsByClassName("inner-circle")[0];

  // 1. 초기화 버튼일 때 누르면 -> 리셋
  if (isFinished) {
    resetGame();
    return;
  }

  // 2. 시작하기 버튼일 때 누르면 -> 타이머 시작
  if (!isRunning) {
    isRunning = true;
    startTime = Date.now();

    // 시작하자마자 버튼은 '놀기'로 변신
    btn.innerText = "놀기!";
    btn.className = "playing";
    warning.innerText = "수업 시간을 노리는 중...";
    warning.className = "";
    stopwatch.className = "stopwatch playing";
    status.innerText = "노는 중...";

    timerId = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      display.innerText = elapsed.toFixed(2);

      // --- 실시간 타이머 체크 ---
      if (elapsed >= 5.0 && elapsed < 5.1) {
        // [5초 구간: 수업하기 등장!]
        stopwatch.className = "stopwatch success";
        btn.className = "success";
        btn.innerText = "수업한다";
        status.innerText = "지금이다!";
      } else if (elapsed >= 5.15) {
        // [5초 초과: 시간 초과로 인한 애니메이션 효과!]
        display.innerText = "하하하";
        display.style.color = "red";

        excitingAnimation();
      } else {
        // [나머지 시간: 놀기 유지]
        stopwatch.className = "stopwatch playing";
        btn.className = "playing";
        btn.innerText = "수업 안 함";
        status.innerText = "수업 준비중...";
      }
    }, 10);
  }

  // 3. 타이머 이벤트
  else {
    const elapsed = (Date.now() - startTime) / 1000;

    if (elapsed >= 5.0 && elapsed < 5.1) {
      // 5초에 성공
      clearInterval(timerId);
      isRunning = false;
      isFinished = true;

      warning.innerText = "야호 성공!";
      warning.className = "msg-success";
      stopwatch.className = "stopwatch success";
      status.innerText = "수업하러가기!";
      display.innerText = " ";

      containerImage.style.backgroundImage =
        "url('../asset/img/timer-Lecture-class.webp')";

      backgroundImage.style.backgroundImage =
        "url('../asset/img/timer-teacherHappy.webp')";

      btn.innerText = "다음 교실로";
      btn.className = "reset-mode";

      // 버튼을 클릭했을 때 main.js의 goNextStage 함수를 실행
      btn.onclick = () => {
        goNextStage();
      };
    } else {
      excitingAnimation();
    }
  }
}

// 애니메이션 효과
function excitingAnimation() {
  clearInterval(timerId);
  isRunning = false;
  isFinished = true;

  const btn = document.getElementById("action-btn");
  const status = document.getElementById("status-text");
  const stopwatch = document.getElementById("stopwatch");
  const warning = document.getElementById("warning-message");
  const backgroundImage = document.getElementsByClassName("inner-circle")[0];
  const containerImage = document.getElementById("container");
  const display = document.getElementById("timer-display");

  warning.innerText = "수업할 수단이 사라졌습니다.";
  warning.className = "msg-danger";
  stopwatch.className = "stopwatch exciting"; // 애니메이션 CSS 클래스
  status.innerText = "신나게 노는 중!";
  status.classList.add("exciting-text");
  backgroundImage.style.backgroundImage =
    "url('../asset/img/timer-classmate.webp')";

  containerImage.style.backgroundImage =
    "url('../asset/img/timer-playing.webp')";

  display.innerText = "하하하";
  display.style.color = "red";

  btn.innerText = "초기화";
  btn.className = "reset-mode"; // 버튼은 회색 초기화로 변신
}

// 초기화 함수
function resetGame() {
  isFinished = false;
  isRunning = false;

  const btn = document.getElementById("action-btn");
  const display = document.getElementById("timer-display");
  const status = document.getElementById("status-text");
  const stopwatch = document.getElementById("stopwatch");
  const warning = document.getElementById("warning-message");
  const backgroundImage = document.getElementsByClassName("inner-circle")[0];
  const containerImage = document.getElementById("container");

  display.innerText = "0.00";
  status.innerText = "수업 준비중!";
  status.classList.remove("exciting-text");
  warning.innerText = "대기 중입니다...";
  warning.className = "";
  stopwatch.className = "stopwatch";
  backgroundImage.style.backgroundImage = "none";
  backgroundImage.style.backgroundColor = "black";

  containerImage.style.backgroundImage =
    "url('../asset/img/timer-teacher.webp')";

  display.style.color = "white";

  btn.innerText = "시작하기";
  btn.className = "";
}
