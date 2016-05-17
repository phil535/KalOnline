import 'mrdoob/three.js';
import FileStream from 'src/utils/filestream.js';

export default class OPLLoader {
  constructor(manager = THREE.DefaultLoadingManager) {
    this.manager = manager;
  }
  load(url, onLoad, onProgress, onError) {
    const loader = new THREE.XHRLoader(this.manager);
    loader.setCrossOrigin(this.crossOrigin);
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

      const posX = fs.read('f') * 8192;
      const posZ = fs.read('f');
      const posY = fs.read('f') * 8192;

      const quaternion = new THREE.Quaternion(fs.read('f'), fs.read('f'), fs.read('f'), fs.read('f'));

      const sclX = fs.read('f');
      const sclZ = fs.read('f');
      const sclY = fs.read('f');

      opl.push({
        url: url,
        pos: new THREE.Vector3(posX, posZ, posY),
        rot: new THREE.Euler().setFromQuaternion(quaternion, 'XZY'),
        scl: new THREE.Vector3(sclX, sclZ, sclY)
      });
    }

    return { header, opl };
  }
}
