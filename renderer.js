// ★ Three.js 読み込み確認
alert("THREE = " + typeof THREE);

let scene, camera, renderer;

// ===== スタートボタン =====
const startBtn = document.getElementById("start");
startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  init3D();
  animate();
});

function init3D() {
  console.log("init3D start");

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 3, 6);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // 光（最小構成）
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(3, 5, 3);
  scene.add(light);

  // ★ テスト用プレイヤー（赤い箱）
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
  );
  box.position.set(0, 0.5, 0);
  scene.add(box);

  console.log("box added");
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
