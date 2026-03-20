localStorage.setItem('key', 2);
getGuide('ㅇㄱㅈㅉㅇㅇ?');

export function initScroll(container, onNext) {
  const buttons = [
    { type: 'fake' },
    { type: 'fake' },
    { type: 'fake' },
    { type: 'fake' },
    { type: 'real' },
    { type: 'fake' },
    { type: 'fake' },
  ];

  const buttonsHTML = buttons
    .map((btn, index) => {
      let marginTop;

      if (index < 4) {
        marginTop = Math.floor(Math.random() * 180 + 120);
      } else {
        marginTop = Math.floor(Math.random() * 60 + 40);
      }

      if (btn.type === 'fake') {
        return `<button class="fake-btn" style="margin-top:${marginTop}vh">수업한다</button>`;
      } else {
        return `<button id="next-btn" style="margin-top:${marginTop}vh">수업한다</button>`;
      }
    })
    .join('');

  container.innerHTML = `
  <p id="scroll-guide">스크롤을 내려 '진짜 수업한다 버튼'을 찾아주세요</p>
  <div id="scroll-container">
    <div id="scroll-content">
      ${buttonsHTML}
    </div>
  </div>

  <!-- 팝업 -->
  <button id="wrong-btn" class="hidden">땡!</button>

  <!-- 오버레이 팝업 -->
  <div id="popup-overlay" class="hidden">
    <div id="popup-box">
      <p id="popup-text">땡!</p>
      <button id="popup-btn">확인</button>
    </div>
  </div>
`;

  const fakeBtns = container.querySelectorAll('.fake-btn');
  const wrongBtn = container.querySelector('#wrong-btn');

  const nextBtn = container.querySelector('#next-btn');
  const popup = container.querySelector('#popup-overlay');
  const popupBtn = container.querySelector('#popup-btn');

  // 가짜 버튼 클릭
  fakeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      wrongBtn.classList.remove('hidden');

      setTimeout(() => {
        wrongBtn.classList.add('hidden');
      }, 800);
    });
  });

  popupBtn.addEventListener('click', () => {
    popup.classList.add('hidden');
  });

  nextBtn.addEventListener('click', () => {
    onNext();
  });
}
