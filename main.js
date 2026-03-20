const pageList = [
  { id: 1, url: '/html/g_basic_screen.html' },
  { id: 2, url: '/html/g_scroll.html' },
  { id: 3, url: '/html/g_timer.html' },
  { id: 4, url: '/html/g_rgb.html' },
  { id: 5, url: '/html/g_drag.html' },
  { id: 6, url: '/html/g_memory.html' },
  { id: 7, url: '/html/g_line.html' },
  { id: 8, url: '/html/g_roulette.html' },
  { id: 9, url: '/html/g_maze.html' },
  { id: 10, url: '/html/g_dark.html' },
  { id: 11, url: '/html/g_photo.html' },
  { id: 12, url: '/html/g_stairs.html' },
  { id: 13, url: '/html/g_final_screen.html' },
];

checkSaveLoadPage();

function getGuide(gameDescription) {
  // 로컬스토리지에 저장된 페이지 번호 가져오기
  let stageNum = localStorage.getItem('key');

  // 헤더의 스테이지 설명 넣기
  const stageInput = document.getElementById('stage-name');
  stageInput.innerText = `스테이지 ${stageNum} : ${gameDescription}`;
}

// 로컬 스토리지를 활용해서 페이지 넘기기
function throwLocalStorage(stageNum) {
  window.location.href = pageList[stageNum].url;
}

// 1. localstorage null이 아닐 때 페이지 이동
// 2. 해당 게임 다시 실행
function loadThisPage(stageNum) {
  let stageBackNumber = stageNum - 1;
  window.location.href = pageList[stageBackNumber].url;
}

// 페이지 불러오는 함수
function checkSaveLoadPage() {
  let stageNum = localStorage.getItem('key');
  if (stageNum !== null) {
    loadThisPage(stageNum);
  }
}

// 처음으로 돌아가는 함수
function returnPage() {
  localStorage.setItem('key', 0);
  window.location.href = pageList[0].url;
}
