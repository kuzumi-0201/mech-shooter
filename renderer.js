let scene, camera, renderer;
let player;
let started = false;
let padIndex = null;

// ===== スタートボタン =====
const startBtn = document.getElementById("start");
startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  started = true;
  init3D();
  animate();
  document.documentElement.requestFullscreen?.();
});

// ===== プロコン接続 =====
window.addEventListener("gamepadconnected", (e) => {
  padIndex = e.gamepad.index;
  console.log("プロコン接続");
});

// ===== 3D初期化 =====
function init3D() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 6, 10);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // ===== 光（正しい書き方）=====
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 10, 5);
  scene.add(dirLight);

  const ambLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambLight);

  // ===== 床 =====
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshStandardMaterial({ color: 0x228b22 })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // ===== プレイヤー（必ず見える）=====
  player = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 1),
    new THREE.MeshStandardMaterial({ color: 0x0000ff })
  );
  player.position.set(0, 1, 0); // 床の上
  scene.add(player);

  // リサイズ対応
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// ===== メインループ =====
function animate() {
  if (!started) return;
  requestAnimationFrame(animate);

  updatePlayer();
  updateCamera();

  renderer.render(scene, camera);
}

// ===== プレイヤー操作 =====
function updatePlayer() {
  if (padIndex === null) return;

  const pad = navigator.getGamepads()[padIndex];
  if (!pad) return;

  const speed = 0.15;
  const x = pad.axes[0];
  const y = pad.axes[1];

  if (Math.abs(x) > 0.15) player.position.x += x * speed;
  if (Math.abs(y) > 0.15) player.position.z += y * speed;
}

// ===== カメラ追従 =====
function updateCamera() {
  camera.position.x = player.position.x;
  camera.position.z = player.position.z + 10;
  camera.lookAt(player.position);
}
