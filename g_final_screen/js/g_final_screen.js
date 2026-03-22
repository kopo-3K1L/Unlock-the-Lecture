//페이지가 모두 로드된 다음에 실행되도록 보장
//notion에 적힌대로 했는데 적용이 안되서 다음 처럼 적용
window.addEventListener('pageshow', () => {
  localStorage.setItem("key", 13);
  getGuide("최종 화면");
});
