import 'systemjs-hot-reloader/default-listener.js';
import 'three';
import 'three/controls/EditorControls.js';
import GTXLoader from '/src/loaders/GTXLoader.js';

const scene = new THREE.Scene();

const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setClearColor( 0xffffff, 0);

const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 1000);
camera.position.x = camera.position.y = camera.position.z = 50;
camera.lookAt(new THREE.Vector3(0, 0, 0));

const controls = new THREE.EditorControls(camera, canvas);
controls.addEventListener('change', () => {
  renderer.render(scene, camera);
});

const loader = new GTXLoader();
const map = loader.load('/DATA/Monster/Clothes/tex/M001.gtx', () => {
  renderer.render(scene, camera);
});

const geometry = new THREE.PlaneGeometry(50, 50, 5, 5);
const material = new THREE.MeshBasicMaterial({ map });
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);
