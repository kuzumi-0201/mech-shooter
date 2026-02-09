let scene, camera, renderer;
let player;
let padIndex = null;
const colliders = [];

// スタート
document.getElementById("start").addEventListener("click", () => {
  document.getElementById("start").style.display = "none";
  init();
  animate();
});

// ゲームパッド
window.addEventListener("gamepadconnected", (e) => {
  padIndex = e.gamepad.index;
});

// 初期化
function init() {
  // シーン
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb); // 青空（見やすさ優先）

  // カメラ（城塞が必ず見える位置）
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    200
  );
  camera.position.set(0, 8, 15);

  // レンダラー
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // 光
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 20, 10);
  scene.add(light);

  // 地面（明るい）
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({
      color: 0x55aa55,
      side: THREE.DoubleSide
    })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // プレイヤー（人形）
  player = createDoll();
  player.position.set(0, 0, 8);
  scene.add(player);

  // 城塞
  createFortress();
}

// 人形
function createDoll() {
  const group = new THREE.Group();

  const mat = new THREE.MeshStandardMaterial({ color: 0xff5555 });

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1.5, 0.6),
    mat
  );
  body.position.y = 1.25;

  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.7, 0.7),
    mat
  );
  head.position.y = 2.4;

  group.add(body, head);
  return group;
}

// 城塞
function createFortress() {
  const mat = new THREE.MeshStandardMaterial({ color: 0x8888ff });

  // 中央建物
  const core = new THREE.Mesh(
    new THREE.BoxGeometry(6, 4, 6),
    mat
  );
  core.position.set(0, 2, 0);
  scene.add(core);
  colliders.push(core);

  // サブ塔
  const tower = new THREE.Mesh(
    new THREE.BoxGeometry(3, 5, 3),
    mat
  );
  tower.position.set(-7, 2.5, 0);
  scene.add(tower);
  colliders.push(tower);
}

// メインループ
function animate() {
  requestAnimationFrame(animate);

  let dx = 0, dz = 0;

  if (padIndex !== null) {
    const pad = navigator.getGamepads()[padIndex];
    if (pad) {
      dx = pad.axes[0] * 0.15;
      dz = pad.axes[1] * 0.15;
    }
  }

  const next = player.position.clone();
  next.x += dx;
  next.z += dz;

  if (!hit(next)) {
    player.position.copy(next);
  }

  // カメラ追従
  camera.position.x = player.position.x;
  camera.position.z = player.position.z + 12;
  camera.position.y = 8;
  camera.lookAt(player.position);

  renderer.render(scene, camera);
}

// 当たり判定
function hit(pos) {
  for (const o of colliders) {
    if (pos.distanceTo(o.position) < 4) return true;
  }
  return false;
}
