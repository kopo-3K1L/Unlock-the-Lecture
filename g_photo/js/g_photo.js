document.addEventListener("DOMContentLoaded", () => {
  const gaugeFill = document.getElementById("gaugeFill");
  const gaugeText = document.getElementById("gaugeText");
  const detectionZone = document.getElementById("detectionZone");
  const beltItems = document.getElementById("beltItems");
  const container = document.getElementById("container");

  // 게임 알림창
  const gameAlert = document.createElement("div");
  gameAlert.id = "gameAlert";
  container.appendChild(gameAlert);

  let gaugeValue = 0;
  let isGameActive = true;
  let boxIdCounter = 0;
  let spawnIntervalId;

  // 1. 초기화 함수
  function resetGame() {
    gaugeValue = 0;
    isGameActive = true;
    boxIdCounter = 0;
    updateGauge();

    beltItems.innerHTML = "";

    detectionZone.classList.remove("completed");
    detectionZone.textContent = "";

    gameAlert.classList.remove("alert-active");
    clearInterval(spawnIntervalId);
    spawnIntervalId = setInterval(createBox, 1100);

    showGameAlert("으아아앙!", "warning");
  }

  // 2. 알림창 표시 함수
  function showGameAlert(message, type) {
    gameAlert.textContent = message;
    gameAlert.className = "";
    gameAlert.classList.add(type, "alert-active");
    setTimeout(() => {
      gameAlert.classList.remove("alert-active");
    }, 600);
  }

  // 3. 게이지별 속도 계산
  function getCurrentSpeed() {
    if (gaugeValue >= 90) return 15;
    if (gaugeValue >= 75) return 12;
    if (gaugeValue >= 60) return 10;
    if (gaugeValue >= 40) return 8;
    if (gaugeValue >= 20) return 6;
    return 4.5;
  }

  // 4. 컨베이어 버튼 생성
  function createBox() {
    if (!isGameActive) return;

    const box = document.createElement("button");
    box.classList.add("box-item");
    box.id = `box-${boxIdCounter++}`;

    const rand = Math.random();

    if (rand < 0.1) {
      // 10% 확률 초기화 박스
      box.classList.add("box-green");
      box.textContent = "함정카드";
      box.dataset.type = "reset";
    } else if (rand < 0.3) {
      // 20% 확률 진짜 정답: 수업하기
      box.classList.add("box-green");
      box.textContent = "수업하기";
      box.dataset.type = "green";
    } else {
      // 70% 확률 수업 안 함
      box.dataset.type = "pink";

      if (gaugeValue >= 70) {
        box.classList.add("box-green"); // 70% 이상일 때 초록색
        box.textContent = "수업 안 함";
      } else {
        box.classList.add("box-pink");
        box.textContent = "수업 안 함";
      }
    }

    beltItems.appendChild(box);

    let position = -250;
    const speed = getCurrentSpeed();

    function moveBox() {
      if (!isGameActive) return;
      position += speed;
      box.style.left = position + "px";

      if (position > 1250) {
        // '진짜 수업하기(green)'를 놓쳤을 때만 감점
        if (box.dataset.type === "green" && box.parentElement) {
          gaugeValue -= 15;

          // 랜덤 숫자 생성 (0 ~ 1 사이)
          const rand = Math.random();
          let missMessage = "";

          if (rand < 0.25) {
            missMessage = "잘 좀 하자...";
          } else if (rand < 0.5) {
            missMessage = "끄아아악";
          } else if (rand < 0.75) {
            missMessage = "??????";
          } else {
            missMessage = "늙기 싫다...";
          }

          // 최종 호출 (뒤에 점수 하락 수치만 붙여줌)
          showGameAlert(`${missMessage} -15%`, "miss");

          updateGauge();
        }
        box.remove();
      } else {
        requestAnimationFrame(moveBox);
      }
    }
    requestAnimationFrame(moveBox);
  }

  // 5. 스페이스바 판정 전용 로직
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && isGameActive) {
      e.preventDefault();
      const zoneRect = detectionZone.getBoundingClientRect();
      const currentBoxes = document.querySelectorAll(".box-item");
      let hitBox = null;

      for (let box of currentBoxes) {
        const boxRect = box.getBoundingClientRect();
        const boxCenter = boxRect.left + boxRect.width / 2;

        // 판정 범위 안에 들어왔는지 확인
        if (boxCenter >= zoneRect.left && boxCenter <= zoneRect.right) {
          hitBox = box;
          break;
        }
      }

      if (hitBox) {
        // 초기화 버튼
        if (hitBox.dataset.type === "reset") {
          resetGame();
        } else {
          const isRealGreen = hitBox.dataset.type === "green";
          checkHit(hitBox, isRealGreen);
        }
      } else {
        gaugeValue -= 5;
        showGameAlert("응 아니야 -5%", "miss");
        updateGauge();
      }
    }
  });

  // 6. 판정 결과 및 점수 처리
  function checkHit(box, isGreen) {
    if (!isGameActive) return;

    const boxRect = box.getBoundingClientRect();
    const zoneRect = detectionZone.getBoundingClientRect();
    const boxCenter = boxRect.left + boxRect.width / 2;
    const zoneCenter = zoneRect.left + zoneRect.width / 2;
    const diff = Math.abs(boxCenter - zoneCenter);

    if (isGreen) {
      if (diff <= 20) {
        gaugeValue += 10;
        showGameAlert("이야호! +10%", "success");
      } else {
        gaugeValue += 5;
        showGameAlert("야호! +5%", "success");
      }
    } else {
      gaugeValue -= 20;

      // 랜덤 숫자 생성 (0 ~ 1 사이)
      const rand = Math.random();
      let missMessage = "";

      if (rand < 0.25) {
        missMessage = "일부러 그러는거야?";
      } else if (rand < 0.5) {
        missMessage = "으악";
      } else if (rand < 0.75) {
        missMessage = "미스~";
      } else {
        missMessage = "ㅋㅋㅋ";
      }

      showGameAlert(missMessage, "warning");
    }
    updateGauge();
    box.remove();
  }

  // 종료 처리
  function updateGauge() {
    if (gaugeValue < 0) gaugeValue = 0;
    gaugeFill.style.width = Math.min(gaugeValue, 100) + "%";
    gaugeText.textContent = Math.floor(Math.min(gaugeValue, 100)) + "%";

    if (gaugeValue >= 100) {
      gaugeValue = 100;
      isGameActive = false;
      clearInterval(spawnIntervalId);
      beltItems.innerHTML = "";
      detectionZone.classList.add("completed");
      detectionZone.textContent = "수업한다";
      showGameAlert("참 잘했어요!", "success");
    }
  }

  // 최초 게임 시작 실행
  spawnIntervalId = setInterval(createBox, 1100);
});
