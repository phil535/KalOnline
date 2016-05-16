import 'mrdoob/three.js';
import 'mrdoob/three.js/controls/EditorControls.js';
import 'mrdoob/three.js/loaders/DDSLoader.js';

let scene = new THREE.Scene();

let canvas = document.getElementById('canvas');
let renderer = new THREE.WebGLRenderer({canvas});

let camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 10000);
camera.position.x = 50;
camera.position.y = 50;
camera.position.z = 50;
camera.lookAt(new THREE.Vector3(0, 0, 0));

let controls = new THREE.EditorControls(camera, canvas);

let loaderDDS = new THREE.DDSLoader();

let geometry = new THREE.PlaneGeometry(512, 512, 1, 1);
let material = new THREE.MeshBasicMaterial({
  map: loaderDDS.load( '../test.dds' )
});

let plane = new THREE.Mesh(geometry, material);
scene.add(plane);

setTimeout(() => {
  console.log(material.map);
}, 1000);

(function animate () {
  renderer.render(scene, camera);

    requestAnimationFrame(animate);
}());
