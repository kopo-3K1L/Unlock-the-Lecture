const container = document.getElementById("container");

let flippedCards = [];
let matchedCount = 0;
let isLocking = false;
let mainContainer = document.getElementById("container");

// 페이지 번호 로컬스토리지에 저장 / 헤더 게임 설명
window.addEventListener('pageshow', () => {
  localStorage.setItem("key", 6);
  getGuide("솔로 지옥 커플 지옥");
});

// 1. 카드 데이터 생성
function getDeck() {
  const deck = [];
  for (let i = 0; i < 12; i++) {
    deck.push({ text: "수업한다", type: "go" });
  }
  for (let i = 0; i < 4; i++) {
    deck.push({ text: "수업 안 함", type: "stop" });
  }
  return deck;
}

// 2. 카드 무작위 섞기
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// 3. 게임 초기화 및 카드 화면 배치
function initGame() {
  if (!container) return;

  const cards = container.querySelectorAll(".card");
  cards.forEach((card) => card.remove());

  flippedCards = [];
  matchedCount = 0;
  isLocking = false;

  const shuffledCards = shuffle(getDeck());

  shuffledCards.forEach((data) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.type = data.type;

    card.innerHTML = `
      <div class="card-face card-back">카드</div>
      <div class="card-face card-front ${data.type}">${data.text}</div>
    `;

    mainContainer.style.backgroundImage =
      "url('../asset/img/timer-teacher.webp')";
    card.addEventListener("click", flipCard);
    container.appendChild(card);
  });
}

// 4. 카드 뒤집기 동작
function flipCard() {
  if (isLocking) return;
  if (this.classList.contains("flipped") || this.classList.contains("matched"))
    return;

  this.classList.add("flipped");
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

// 5. 승리/실패 판정 로직
function checkMatch() {
  isLocking = true;
  const [card1, card2] = flippedCards;
  const type1 = card1.dataset.type;
  const type2 = card2.dataset.type;

  // 실패: 핑크색 2개 선택 시 초기화
  if (type1 === "stop" && type2 === "stop") {
    mainContainer.style.backgroundImage =
      "url('../asset/img/timer-playing.webp')";

    setTimeout(() => {
      alert("실패");
      initGame();
    }, 600);
  }
  // 성공 : 초록색 2개 선택 시 삭제
  else if (type1 === "go" && type2 === "go") {
    setTimeout(() => {
      card1.classList.add("matched");
      card2.classList.add("matched");
      matchedCount += 2;
      flippedCards = [];
      isLocking = false;

      // 초록색 12장을 모두 찾았을 때
      if (matchedCount === 12) {
        alert("성공");
        goNextStage();
      }
    }, 600);
  }
  // 미스: 다시 뒤집기
  else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
      isLocking = false;
    }, 800);
  }
}
initGame();
