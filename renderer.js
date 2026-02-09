let padIndex = null;
let started = false;

// スタートボタン（スマホ対策）
const startBtn = document.getElementById("start");
startBtn.addEventListener("click", () => {
  started = true;
  startBtn.style.display = "none";
  console.log("ゲーム開始");

  // フルスクリーン（できる端末だけ）
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
      }
    });

    // 左スティック（移動用）
    const x = pad.axes[0];
    const y = pad.axes[1];
    if (Math.abs(x) > 0.2 || Math.abs(y) > 0.2) {
      console.log("スティック:", x.toFixed(2), y.toFixed(2));
    }
  }

  requestAnimationFrame(loop);
}
