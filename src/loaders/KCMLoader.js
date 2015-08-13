import 'mrdoob/three.js';
import FileStream from '../utils/FileStream.js';

export default class KCMLoader {
	
	constructor (manager = THREE.DefaultLoadingManager) {
		this.manager = manager;
	}

	load (url, onLoad, onProgress, onError) {
		let loader = new THREE.XHRLoader(this.manager);
		loader.setCrossOrigin(this.crossOrigin);
		loader.setResponseType('arraybuffer');
		loader.load(url, (data) => {
			this.parse(data, onLoad);
		}, onProgress, onError);
	}
	
	parse (data, onLoad) {
		let fs = new FileStream(data);

		let header = {
			CRC32: fs.read('<I'), 
			unknown0: fs.read('<I'), 
			mapX: fs.read('<I'), 
			mapY: fs.read('<I'), 
			unknown1: fs.read('<I'), 
			unknown2: fs.read('<I'), 
			unknown3: fs.read('<I'), 
			unknown4: fs.read('<I'), 
			unknown5: fs.read('<I')
		};

		let textureMaps = [];

		for (let i = 0; i < 8; i ++) {
			let texture = fs.read('<B');

			if (texture !== 255) {
				textureMaps.push({"texture": texture, "map": []});
			}
		}

		for (let i = 1; i < textureMaps.length; i ++) {
			for (let y = 0; y < 256; y ++) {
				for (let x = 0; x < 256; x ++) {
					let j = y * 256 + x;
					textureMaps[i].map[j] = fs.read('<B');
				}
			}
		}

		let heightMap = [];

		for (let y = 0; y < 257; y ++) {
			for (let x = 0; x < 257; x ++) {
				//let i = (256-y) * 257 + x;
				let i = (y) * 257 + x;
				heightMap[i] = fs.read('<H');
			}
		}

		let colorMap = [];

		for (let y = 0; y < 256; y ++) {
			for (let x = 0; x < 256; x ++) {
				//let i = (255-y) * 256 + x;
				let i = (y) * 256 + x;

				let b = fs.read('<B');
				let g = fs.read('<B');
				let r = fs.read('<B');

				colorMap[i*3] = r;
				colorMap[i*3 + 1] = g;
				colorMap[i*3 + 2] = b;
			}
		}

		for (let y = 0; y < 256; y ++) {
			for (let x = 0; x < 256; x ++) {
				let c = fs.read('<B');
			}
		}

		onLoad({
			header, 
			textureMaps, 
			colorMap
		});
	}
};
