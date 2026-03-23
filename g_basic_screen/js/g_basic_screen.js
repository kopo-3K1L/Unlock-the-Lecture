window.addEventListener('pageshow', () => {
  localStorage.setItem("key", 1);
  getGuide("시작화면");
});

function changeImageHandler() {
  const container = document.getElementById("container");
  const button = document.getElementById("red-button");
  container.style.backgroundImage =
    "url('../asset/img/basicscreenanotherversion.webp')";
  button.innerText = "수업 들으세요~";
}
//나중에 구현할
function startHandler() {}
