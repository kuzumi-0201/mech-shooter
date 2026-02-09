alert(typeof THREE);
const startBtn = document.getElementById("start");

startBtn.onclick = () => {
  startBtn.style.display = "none";

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xff0000); // 赤
  document.body.appendChild(renderer.domElement);
};
