document.addEventListener("DOMContentLoaded", () => {
  const settingsBtn = document.getElementById("settings-btn");
  const modal = document.getElementById("settings-modal");
  const closeModal = document.getElementById("btn-close-modal");

  // 모달
  if (settingsBtn && modal && closeModal) {
    settingsBtn.addEventListener("click", () => {
      modal.style.display = "flex";
    });
    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
    });
    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });
  }

  // 2. 버튼 기능 연결 (main.js의 함수 호출)
  // 처음부터 시작 버튼
  const btnRestartAll = document.getElementById("btn-restart-all");
  if (btnRestartAll) {
    btnRestartAll.onclick = () => {
      if (confirm("처음부터 시작하시겠습니까? 모든 진행 사항이 삭제됩니다.")) {
        resetAllStages(); // main.js의 함수 실행
      }
    };
  }

  // 스테이지 재시작 버튼
  const btnRestartStage = document.getElementById("btn-restart-stage");
  if (btnRestartStage) {
    btnRestartStage.onclick = () => {
      replayThisStage(); // main.js의 함수 실행 (현재 스테이지 리로드)
    };
  }

  // 넘어가기 버튼
  const btnSkipStage = document.getElementById("btn-skip-stage");
  if (btnSkipStage) {
    btnSkipStage.onclick = () => {
      if (confirm("이 스테이지를 건너뛰고 다음으로 넘어갈까요?")) {
        goNextStage(); // main.js의 함수 실행 (다음 스테이지 이동)
      }
    };
  }
});
