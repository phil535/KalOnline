import 'mrdoob/three.js';
import FileStream from 'src/utils/filestream.js';

const Q = new THREE.Quaternion();

export default class OPLLoader {
  constructor(manager = THREE.DefaultLoadingManager) {
    this.manager = manager;
  }
  load(url, onLoad, onProgress, onError) {
    const loader = new THREE.XHRLoader(this.manager);
    // loader.setCrossOrigin(this.crossOrigin);
    loader.setResponseType('arraybuffer');
    loader.load(url, (data) => {
      onLoad(this.parse(data));
    }, onProgress, onError);
  }
  parse(data) {
    const fs = new FileStream(data, true);

    const header = {
      CRC32: fs.read('I'),
      unknown0: fs.read('I'),
      mapX: fs.read('I'),
      mapY: fs.read('I'),
      unknown1: fs.read('I'),
      unknown2: fs.read('I'),
      unknown3: fs.read('I'),
      unknown4: fs.read('I'),
      unknown5: fs.read('I'),
      objectCount: fs.read('I')
    };

    const opl = [];
    for (let i = 0; i < header.objectCount; i ++) {
      const urlLength = fs.read('I');
      const url = `${fs.readString(urlLength)}.gb`;

      const pos = new THREE.Vector3(fs.read('f') * 8192, fs.read('f'), fs.read('f') * 8192);
      Q.set(fs.read('f'), fs.read('f'), fs.read('f'), fs.read('f'));
      const rot = new THREE.Euler().setFromQuaternion(Q, 'XZY');
      const scl = new THREE.Vector3(fs.read('f'), fs.read('f'), fs.read('f'));

      opl.push({ url, pos, rot, scl });
    }

    return { header, opl };
  }
}
