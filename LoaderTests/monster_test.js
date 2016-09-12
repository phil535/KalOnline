import 'systemjs-hot-reloader/default-listener.js';
import 'mrdoob/three.js';
import 'mrdoob/three.js/controls/EditorControls.js';
import GBObject from 'src/model/GBObject.js';
import GTXLoader from 'src/loaders/GTXLoader.js';
import Model from 'src/model/Model.js';

const formation = [
  new GBObject('/DATA/Monster/Clothes/M001_H1.gb'),
  new GBObject('/DATA/Monster/Clothes/M001_B1.gb')
];
const bones = new GBObject('/DATA/Monster/Motion/T001_Bone.gb');
const animation = new GBObject('/DATA/Monster/Motion/T001_0_A_01.gb');

const clock = new THREE.Clock();

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('canvas')
});

const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 1000);
camera.position.set(50, 50, -50);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const controls = new THREE.EditorControls(camera, canvas);

const monster = new Model();
monster.setGeometry(formation, bones);
monster.setAnimation(animation);

scene.add(monster.container);

(function animate() {
  const delta = clock.getDelta();
  THREE.AnimationHandler.update(delta);

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}());
