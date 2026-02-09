// ==== Three.js 読み込み確認 ====
alert("THREE = " + typeof THREE);

let scene, camera, renderer;
let player;
let padIndex = null;

// ==== スタートボタン ====
const startBtn = document.getElementById("start");
startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  init();
  animate();
});

// ==== ゲームパッド接続 ====
window.addEventListener("gamepadconnected", (e) => {
  padIndex = e.gamepad.index;
  console.log("Gamepad connected");
});

// ==== 初期化 ====
function init() {
  // シーン
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);

  // カメラ
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 3, 6);

  // レンダラー
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // 光
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 5);
  scene.add(light);

  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  // 地面
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshStandardMaterial({ color: 0x228b22 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // プレイヤー（赤い箱）
  player = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
  );
  player.position.set(0, 0.5, 0);
  scene.add(player);

  // テスト用ブロック（茶色）
  const block = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0x8b4513 })
  );
  block.position.set(3, 0.5, 0);
  scene.add(block);
}

// ==== メインループ ====
function animate() {
  requestAnimationFrame(animate);

  // プレイヤー移動（左スティック）
  if (padIndex !== null) {
    const pad = navigator.getGamepads()[padIndex];
    if (pad) {
      const x = pad.axes[0];
      const y = pad.axes[1];

      player.position.x += x * 0.1;
      player.position.z += y * 0.1;
    }
  }

  // カメラ追従
  camera.position.x = player.position.x;
  camera.position.z = player.position.z + 6;
  camera.position.y = player.position.y + 3;
  camera.lookAt(player.position);

  renderer.render(scene, camera);
}
