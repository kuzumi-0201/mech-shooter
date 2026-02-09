let scene, camera, renderer;
let player;
let padIndex = null;
const colliders = [];

// カメラ制御用
let camYaw = 0;    // 左右回転
let camPitch = 0;  // 上下回転
const camDistance = 12;

// スタート
document.getElementById("start").addEventListener("click", () => {
  document.getElementById("start").style.display = "none";
  init();
  animate();
});

// ゲームパッド
window.addEventListener("gamepadconnected", (e) => {
  padIndex = e.gamepad.index;
  console.log("gamepad connected");
});

// 初期化
function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    300
  );

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // 光
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 20, 10);
  scene.add(light);

  // 地面
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshStandardMaterial({
      color: 0x55aa55,
      side: THREE.DoubleSide
    })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // プレイヤー（人形）
  player = createDoll();
  player.position.set(0, 0, 10);
  scene.add(player);

  // 城塞
  createFortress();
}

// 人形
function createDoll() {
  const g = new THREE.Group();
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

  g.add(body, head);
  return g;
}

// 城塞
function createFortress() {
  const mat = new THREE.MeshStandardMaterial({ color: 0x8888ff });

  const core = new THREE.Mesh(
    new THREE.BoxGeometry(6, 4, 6),
    mat
  );
  core.position.set(0, 2, 0);
  scene.add(core);
  colliders.push(core);

  const tower = new THREE.Mesh(
    new THREE.BoxGeometry(3, 5, 3),
    mat
  );
  tower.position.set(-8, 2.5, 0);
  scene.add(tower);
  colliders.push(tower);
}

// メインループ
function animate() {
  requestAnimationFrame(animate);

  let moveX = 0, moveZ = 0;
  let lookX = 0, lookY = 0;

  if (padIndex !== null) {
    const pad = navigator.getGamepads()[padIndex];
    if (pad) {
      // 左スティック：移動
      moveX = pad.axes[0] * 0.15;
      moveZ = pad.axes[1] * 0.15;

      // ★ 右スティック：視点
      lookX = pad.axes[2] * 0.04;
      lookY = pad.axes[3] * 0.04;
    }
  }

  // プレイヤー移動
  const next = player.position.clone();
  next.x += moveX;
  next.z += moveZ;

  if (!hit(next)) {
    player.position.copy(next);
  }

  // カメラ回転
  camYaw -= lookX;
  camPitch -= lookY;
  camPitch = Math.max(-1.2, Math.min(0.3, camPitch)); // 上下制限

  // カメラ位置計算
  camera.position.x =
    player.position.x + Math.sin(camYaw) * camDistance;
  camera.position.z =
    player.position.z + Math.cos(camYaw) * camDistance;
  camera.position.y =
    player.position.y + 4 + camPitch * 5;

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
