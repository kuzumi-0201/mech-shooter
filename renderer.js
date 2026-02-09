// ==== Three.js 確認 ====
alert("THREE = " + typeof THREE);

let scene, camera, renderer, player;

// ==== スタート ====
const startBtn = document.getElementById("start");
startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  init();
  animate();
});

function init() {
  console.log("init start");

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
  camera.lookAt(0, 0, 0);

  // レンダラー
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // 光
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(3, 5, 3);
  scene.add(light);

  // ★ プレイヤー（赤い箱）
  player = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
  );
  player.position.set(0, 0.5, 0);
  scene.add(player);

  console.log("player added");
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
