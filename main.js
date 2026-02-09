const titleScreen = document.getElementById("titleScreen");
const startBtn = document.getElementById("startBtn");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

startBtn.addEventListener("click", async () => {
  // フルスクリーン
  if (document.documentElement.requestFullscreen) {
    await document.documentElement.requestFullscreen();
  }

  // 横向き固定（対応端末のみ）
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock("landscape").catch(() => {});
  }

  titleScreen.style.display = "none";
  canvas.style.display = "block";

  startGame();
});

function startGame() {
  ctx.fillStyle = "darkgreen";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "30px sans-serif";
  ctx.fillText("RPG START!", 280, 220);
}
