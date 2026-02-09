// Three.js が読み込めているか確認
alert(typeof THREE); // object ならOK

let scene, camera, renderer;
let started = false;

// スタートボタン
const startBtn = document.getElementById("start");
startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  started = true;
  init3D();
  animate();

  // フルスクリーン（できる端末だけ）
  document.documentElement.requestFullscreen?.();
});

function init3D() {
  // シーン
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb); // 空色

  // カメラ
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 6, 10);
  camera.lookAt(0, 0, 0);

  // レンダラー
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // 光
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 5);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  // 床（マップ）
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshStandardMaterial({ color: 0x228b22 })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // 箱（建物・オブジェクト）
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshStandardMaterial({ color: 0x8b4513 })
  );
  box.position.set(0, 1, 0);
  scene.add(box);

  // 画面サイズ変更対応
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function animate() {
  if (!started) return;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
