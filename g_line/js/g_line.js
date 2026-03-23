//페이지가 모두 로드된 다음에 실행되도록 보장
//notion에 적힌대로 했는데 적용이 안되서 다음 처럼 적용
window.addEventListener('pageshow', () => {
  localStorage.setItem("key", 7);
  getGuide("선 넘지 마세요 제발");
});

const guide = document.getElementById("line-guide");
guide.innerText =
  "움직이는 블럭이 랜덤 기준선에 닿는 순간 버튼을 누르는 타이밍 게임";
const startButton = document.getElementById("startButton");
startButton.innerText = "게임 시작하기";
const body = document.getElementsByTagName("body");
const container = document.getElementById("container");
let animationId = null;
let blockY = null;
let gamestate = "HOME";
let isSuccess = false;
//버튼의 상태 정보를 업데이트 하는 함수
function setGameState(newState) {
  gamestate = newState;
  render();
}

//버튼을 클릭 할 때마다 수행햐야 할 로직 수행 및 버튼 스타일 변경하는 함수
function render() {
  const oldMsg = document.getElementById("result-msg");
  const oldLine = document.querySelectorAll(".line");
  const oldBlock = document.getElementById("block");
  if (oldLine) {
    oldLine.forEach((li) => li.remove());
  }
  if (oldBlock) oldBlock.remove();
  if (animationId) cancelAnimationFrame(animationId);

  if (oldMsg) oldMsg.remove();
  if (gamestate == "HOME") {
    container.style.backgroundImage =
      "url('../asset/img/linegamecharacter.webp')";
    startButton.style.backgroundColor = "#263747";
    startButton.onclick = () => setGameState("PLAYING");
  } else if (gamestate == "PLAYING") {
    drawLine();
    generateBlock();
    blockY = 80;
    moveBlock();
    container.style.backgroundImage = "none";
    startButton.style.backgroundColor = "#ef4444";
    startButton.innerText = "타이밍 맞춰 누르세요";
    startButton.onclick = () => {
      isSuccess = checkBaseLine();
      setGameState("RESULT");
    };
  } else if (gamestate == "RESULT") {
    container.style.backgroundImage =
      "url('../asset/img/linegamecharacter.webp')";
    const p = document.createElement("p");
    p.id = "result-msg";
    if (isSuccess) {
      goNextStage();
    } else {
      p.innerText = "실패했습니다.";
      p.style.color = "#ef4444";
    }
    p.style.fontSize = "40px";
    p.style.fontWeight = "bold";
    p.style.textAlign = "center";
    p.style.position = "absolute";
    p.style.left = "50%";
    p.style.top = "70%";
    p.style.whiteSpace = "nowrap";
    p.style.transform = "translate(-50%,-50%)";
    startButton.style.backgroundColor = "#263747";
    startButton.innerText = "게임시작하기";
    startButton.before(p);
    startButton.onclick = () => setGameState("HOME");
  }
}

//랜덤한 숫자 생성하는 함수
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//랜덤한 위치에 선을 그리는 함수
function drawLine() {
  const guideBottom = guide.offsetTop + guide.offsetHeight;

  const buttonTop = startButton.offsetTop;

  let min = guideBottom + 20;
  let max = buttonTop - 70;

  if (max < min) max = min + 10;

  let y = getRandomInt(min, max);

  const line = document.createElement("div");
  line.className = "line";
  line.style.borderTop = "3px solid gold";
  line.style.position = "absolute";
  line.style.left = "50%";
  line.style.top = `${y}px`;
  line.style.width = "100%";
  line.style.transform = "translate(-50%, -50%)";
  //line.style.zIndex = "5";

  container.appendChild(line);
}
//블럭 생성하는 함수
function generateBlock() {
  const block = document.createElement("div");
  block.id = "block";
  block.style.position = "absolute";
  block.style.left = "50%";
  block.style.top = "70%";
  block.style.transform = "translate(-50%,-50%)";
  block.style.backgroundColor = "#2ecc71";
  block.style.width = "5%";
  block.style.height = "5%";
  block.style.boxShadow = "0 0 10px #2ecc71,0 0 20px #2ecc71,0 0 40px #27ae60";
  block.style.filter = "brightness(1.2)";
  startButton.before(block);
}

let baseSpeed = 0.5;
//블럭 이동하는 함수
function moveBlock() {
  let varialeSpeed = baseSpeed + Math.random() * 3.4;
  blockY -= varialeSpeed;
  const containerHeight = container.offsetHeight;
  const guideLimit =
    ((guide.offsetTop + guide.offsetHeight) / containerHeight) * 100;

  //가이드에 닿았는지 확인
  if (blockY <= guideLimit + 2.5) {
    blockY = 80;
  }
  const block = document.getElementById("block");
  if (block) {
    block.style.top = blockY + "%";

    block.style.filter = `brightness(${1.2 + Math.random() * 0.3})`;
  }
  animationId = requestAnimationFrame(moveBlock);
}

//기준선에 도달했는지 확인하는 함수
function checkBaseLine() {
  const baseLine = document.querySelector(".line");
  const block = document.getElementById("block");
  if (!baseLine || !block) return;
  const targetY = baseLine.offsetTop;
  const currentY = block.offsetTop;
  const tolerance = 25;
  const diff = Math.abs(targetY - currentY);
  if (diff <= tolerance) {
    return true;
  } else {
    return false;
  }
}

render();
