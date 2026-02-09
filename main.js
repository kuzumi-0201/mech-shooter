// シーン
const scene = new THREE.Scene();

// カメラ
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 3, 6);

// レンダラー
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ライト
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

// 地面
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({ color: 0x228822 })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// プレイヤー
const player = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x00aaff })
);
player.position.y = 0.5;
scene.add(player);

// 画面サイズ対応
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 🎮 Proコン操作
function handleGamepad() {
  const gp = navigator.getGamepads()[0];
  if (!gp) return;

  const x = gp.axes[0];
  const z = gp.axes[1];

  player.position.x += x * 0.1;
  player.position.z += z * 0.1;

  // Bボタンでジャンプ
  if (gp.buttons[1].pressed && player.position.y <= 0.5) {
    player.position.y = 1.5;
  }

  // 重力
  if (player.position.y > 0.5) {
    player.position.y -= 0.08;
  }

  // カメラ追従
  camera.position.x = player.position.x;
  camera.position.z = player.position.z + 6;
  camera.lookAt(player.position);
}

// ループ
function animate() {
  requestAnimationFrame(animate);
  handleGamepad();
  renderer.render(scene, camera);
}
animate();
