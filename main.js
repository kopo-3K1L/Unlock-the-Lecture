const pageList = [
  { id: 1, url: "/Unlock-the-Lecture/html/g_basic_screen.html" },
  { id: 2, url: "/Unlock-the-Lecture/html/g_scroll.html" },
  { id: 3, url: "/Unlock-the-Lecture/html/g_timer.html" },
  { id: 4, url: "/Unlock-the-Lecture/html/g_rgb.html" },
  { id: 5, url: "/Unlock-the-Lecture/html/g_drag.html" },
  { id: 6, url: "/Unlock-the-Lecture/html/g_memory.html" },
  { id: 7, url: "/Unlock-the-Lecture/html/g_line.html" },
  { id: 8, url: "/Unlock-the-Lecture/html/g_roulette.html" },
  { id: 9, url: "/Unlock-the-Lecture/html/g_maze.html" },
  { id: 10, url: "/Unlock-the-Lecture/html/g_dark.html" },
  { id: 11, url: "/Unlock-the-Lecture/html/g_photo.html" },
  { id: 12, url: "/Unlock-the-Lecture/html/g_stairs.html" },
  { id: 13, url: "/Unlock-the-Lecture/html/g_final_screen.html" },
];

// 헤더에 띄우는 스테이지 번호와 게임명
function getGuide(gameDescription) {
  let stageNum = localStorage.getItem("key");
  const stageInput = document.getElementById("stage-name");
  stageInput.innerText = `스테이지 ${stageNum} : ${gameDescription}`;
}

// 다음 스테이지로 이동
function goNextStage() {
  let stageNum = localStorage.getItem("key");
  window.location.href = pageList[stageNum].url;
}

// 현재 스테이지 다시 하게 리로드하기
function replayThisStage() {
  let stageNum = localStorage.getItem("key");
  window.location.href = pageList[stageNum - 1].url;
}

// 접속 시 이어하기 판단
function checkSaveLoadPage() {
  let stageNum = localStorage.getItem("key");
  if (stageNum === null) {
    window.location.href = "/Unlock-the-Lecture/html/g_basic_screen.html";
    return;
  }
  replayThisStage();
}

// 처음부터 다시 하기
function resetAllStages() {
  localStorage.removeItem("key");
  window.location.href = "/Unlock-the-Lecture/index.html";
}
