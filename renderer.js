let scene, camera, renderer;
let player;
let padIndex = null;
const colliders = [];

// スタート
const startBtn = document.getElementById("start");
startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  requestFullscreen();
  init();
  animate();
});

// フルスクリーン
function requestFullscreen() {
  if (document.body.requestFullscreen) {
    document.body.requestFullscreen();
  }
}

// ゲームパッド
window.addEventListener("gamepadconnected", (e) => {
  padIndex = e.gamepad.index;
});

// 初期化
function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0f1f);

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    200
  );

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // 光（近未来感）
  scene.add(new THREE.AmbientLight(0x8899ff, 0.4));

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 20, 10);
  scene.add(light);

  // 床
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({
      color: 0x111111,
      side: THREE.DoubleSide
    })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // プレイヤー（人形）
  player = createDoll();
  player.position.set(0, 0, 10);
  scene.add(player);

  // 城塞（拠点）
  createFortress();
}

// 人形プレイヤー
function createDoll() {
  const group = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xdddddd });

  const torso = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 1.2, 0.4),
    bodyMat
  );
  torso.position.y = 1.6;

  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.6, 0.6),
    bodyMat
  );
  head.position.y = 2.5;

  group.add(torso, head);
  group.userData.radius = 0.6; // 当たり判定用

  return group;
}

// 城塞作成
function createFortress() {
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x334455 });

  // 中央建物（武器作成）
  const core = new THREE.Mesh(
    new THREE.BoxGeometry(6, 4, 6),
    wallMat
  );
  core.position.set(0, 2, 0);
  scene.add(core);
  colliders.push(core);

  // 左塔（クエスト受付）
  const tower = new THREE.Mesh(
    new THREE.BoxGeometry(3, 5, 3),
    wallMat
  );
  tower.position.set(-6, 2.5, 0);
  scene.add(tower);
  colliders.push(tower);
}

// メインループ
function animate() {
  requestAnimationFrame(animate);

  let moveX = 0;
  let moveZ = 0;

  if (padIndex !== null) {
    const pad = navigator.getGamepads()[padIndex];
    if (pad) {
      moveX = pad.axes[0] * 0.15;
      moveZ = pad.axes[1] * 0.15;
    }
  }

  const nextPos = player.position.clone();
  nextPos.x += moveX;
  nextPos.z += moveZ;

  if (!checkCollision(nextPos)) {
    player.position.copy(nextPos);
  }

  // カメラ追従
  camera.position.set(
    player.position.x,
    player.position.y + 4,
    player.position.z + 8
  );
  camera.lookAt(player.position);

  renderer.render(scene, camera);
}

// 当たり判定
function checkCollision(nextPos) {
  for (const obj of colliders) {
    const dist = nextPos.distanceTo(obj.position);
    if (dist < 4) return true;
  }
  return false;
}
