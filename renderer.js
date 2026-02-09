window.addEventListener("gamepadconnected", (e) => {
  alert("プロコン認識！");
});
let padIndex = null;

window.addEventListener("gamepadconnected", (e) => {
  padIndex = e.gamepad.index;
  alert("プロコン認識！");
  requestAnimationFrame(loop);
});

function loop() {
  const pad = navigator.getGamepads()[padIndex];
  if (pad) {
    pad.buttons.forEach((b, i) => {
      if (b.pressed) {
        console.log("押されたボタン番号:", i);
      }
    });
  }
  requestAnimationFrame(loop);
}
