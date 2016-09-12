import 'systemjs-hot-reloader/default-listener.js';
import 'mrdoob/three.js';
import 'mrdoob/three.js/controls/EditorControls.js';
import GBLoader from '/src/loaders/GBLoader.js';
import { sleep } from '/src/utils/Utils.js';

const files = [
  'M001_B1.gb',
  'M001_H1.gb',
  'M001_H2.gb',
  'M002_B1.gb',
  'M002_H1.gb',
  'M002_H2.gb',
  'M003_B1.gb',
  'M003_H1.gb',
  'M003_H2.gb',
  'M004_B1.gb',
  'M004_H1.gb',
  'M004_H2.gb',
  'M005_B1.gb',
  'M005_H1.gb',
  'M005_H2.gb',
  'M006_B1.gb',
  'M006_H1.gb',
  'M006_H2.gb',
  'M007_B1.gb',
  'M007_H1.gb',
  'M007_H2.gb',
  'M008_B1.gb',
  'M008_H1.gb',
  'M008_H2.gb',
  'M009_B1.gb',
  'M009_H1.gb',
  'M009_H2.gb',
  'M010_B1.gb',
  'M010_H1.gb',
  'M010_H2.gb',
  'M011_B1.gb',
  'M011_H1.gb',
  'M011_H2.gb',
  'M012_B1.gb',
  'M012_H1.gb',
  'M012_H2.gb',
  'M013_B1.gb',
  'M013_H1.gb',
  'M013_H2.gb',
  'M014_B1.gb',
  'M014_H1.gb',
  'M014_H2.gb',
  'M015_B1.gb',
  'M015_H1.gb',
  'M015_H2.gb',
  'M016_B1.gb',
  'M016_H1.gb',
  'M016_H2.gb',
  'M017_B1.gb',
  'M017_H1.gb',
  'M017_H2.gb',
  'M018_B1.gb',
  'M018_H1.gb',
  'M018_H2.gb',
  'M019_B1.gb',
  'M019_H1.gb',
  'M019_H2.gb',
  'M020_B1.gb',
  'M020_H1.gb',
  'M020_H2.gb',
  'M021_B1.gb',
  'M021_B2.gb',
  'M021_H1.gb',
  'M021_H2.gb',
  'M022_B1.gb',
  'M022_B2.gb',
  'M022_H1.gb',
  'M022_H2.gb',
  'M023_B1.gb',
  'M023_B2.gb',
  'M023_H1.gb',
  'M023_H2.gb',
  'M024_B1.gb',
  'M024_B2.gb',
  'M024_H1.gb',
  'M024_H2.gb',
  'M025_B1.gb',
  'M026_B1.gb',
  'M027_B1.gb',
  'M028_B1.gb',
  'M029_B1.gb',
  'M030_B1.gb',
  'M031_B1.gb',
  'M032_B1.gb',
  'M033_B1.gb',
  'M034_B1.gb',
  'M035_B1.gb',
  'M035_B2.gb',
  'M035_B3.gb',
  'M035_B4.gb',
  'M037_B1.gb',
  'M037_B2.gb',
  'M037_H1.gb',
  'M037_H2.gb',
  'M038_B1.gb',
  'M038_B2.gb',
  'M038_H1.gb',
  'M038_H2.gb',
  'M039_B1.gb',
  'M039_B2.gb',
  'M039_H1.gb',
  'M039_H2.gb',
  'M040_B1.gb',
  'M040_B2.gb',
  'M040_H1.gb',
  'M040_H2.gb'
];

const scene = new THREE.Scene();

const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ canvas });

const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 1000);
camera.position.x = 50;
camera.position.y = 50;
camera.position.z = -50;
camera.lookAt(new THREE.Vector3(0, 0, 0));

const controls = new THREE.EditorControls(camera, canvas);

function loaded({ geometry, materials }) {
  const material = new THREE.MeshFaceMaterial(materials);
  const mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);
}

const headers = {};
const loader = new GBLoader();
(async () => {
  for (let i = 0; i < files.length; i ++) {
    const file = files[i];
    await new Promise((resolve) => {
      loader.load(`/DATA/Monster/Clothes/${file}`, ({ header }) => {
        headers[file] = header;
        resolve();
      });
    });
  }
  console.log(JSON.stringify(headers, null, 2));
}());

// loader.load('/Data/OBJECTS/b/1/land/[a]tree_p02.gb', loaded);

(function animate() {
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}());
