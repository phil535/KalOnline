import 'mrdoob/three.js';
import FileStream from 'src/utils/filestream.js';

export default class KCMLoader {
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
      unknown5: fs.read('I')
    };

    const textureMaps = [];
    for (let i = 0; i < 8; i ++) {
      const textureID = fs.read('B');

      if (textureID !== 255) {
        textureMaps.push({
          textureID,
          alphaMap: [],
          firstLayer: (i === 0)
        });
      }
    }

    fs.position = 52;

    for (let i = 1; i < textureMaps.length; i ++) {
      for (let y = 0; y < 256; y ++) {
        for (let x = 0; x < 256; x ++) {
          const j = y * 256 + x;
          textureMaps[i].alphaMap[j] = fs.read('B');
        }
      }
    }

    const heightMap = [];
    for (let y = 0; y < 257; y ++) {
      for (let x = 0; x < 257; x ++) {
        const i = (y) * 257 + x;
        heightMap[i] = fs.read('H');
      }
    }

    const colorMap = [];
    for (let y = 0; y < 256; y ++) {
      for (let x = 0; x < 256; x ++) {
        //let i = (255-y) * 256 + x;
        const i = (y) * 256 + x;

        const b = fs.read('B');
        const g = fs.read('B');
        const r = fs.read('B');

        colorMap[i * 3] = r;
        colorMap[i * 3 + 1] = g;
        colorMap[i * 3 + 2] = b;
      }
    }

    for (let y = 0; y < 256; y ++) {
      for (let x = 0; x < 256; x ++) {
        const c = fs.read('B');
      }
    }

    return { header, textureMaps, heightMap, colorMap };
  }
}
