let padIndex = null;
let started = false;

const startBtn = document.getElementById("start");

startBtn.addEventListener("click", () => {
  started = true;
  startBtn.style.display = "none";
  document.body.style.background = "#222";
  document.body.innerHTML = "<h1>🎮 ゲーム中</h1><p>プロコン操作を確認中…</p>";
  document.documentElement.requestFullscreen?.();
});

// プロコン接続検知
window.addEventListener("gamepadconnected", (e) => {
  padIndex = e.gamepad.index;
  alert("プロコン認識！");
  requestAnimationFrame(loop);
});

function loop() {
  if (!started) {
    requestAnimationFrame(loop);
    return;
  }

  const pad = navigator.getGamepads()[padIndex];
  if (pad) {
    pad.buttons.forEach((b, i) => {
      if (b.pressed) {
        console.log("押されたボタン番号:", i);
        document.body.innerHTML =
          `<h1>🎮 ゲーム中</h1><p>ボタン ${i} が押された！</p>`;
      }
    });
  }

  requestAnimationFrame(loop);
}
