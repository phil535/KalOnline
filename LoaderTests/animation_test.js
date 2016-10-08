import 'systemjs-hot-reloader/default-listener.js';
import 'mrdoob/three.js';
import 'mrdoob/three.js/controls/EditorControls.js';
import Player from '/src/model/Player.js';
import GBObject from '/src/model/GBObject.js';
import { KNIGHT } from 'src/Constants.js';

const canvas = document.getElementById('canvas');

const clock = new THREE.Clock();
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ canvas });

const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 1000);
camera.position.set(0, 20, -50);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const controls = new THREE.EditorControls(camera, canvas);

const model = new Player(KNIGHT, { a: 3, p: 3, g: 3, s: 3, f: 1, h1: 3, h2: 1 });
scene.add(model.container);

(function animate() {
  const delta = clock.getDelta();
  THREE.AnimationHandler.update(delta);

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}());
