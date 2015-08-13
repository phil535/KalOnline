import 'mrdoob/three.js';
import FileStream from 'casperlamboo/filestream';

export default class OPLLoader {

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
		let fs = new FileStream(data, true);

		let header = {
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

		let opl = [];

		for (let i = 0; i < header.objectCount; i ++) {
			let urlLength = fs.read('I');

			let url = fs.readString(urlLength) + '.gb';

			let posX = fs.read('f') * 8192;
			let posZ = fs.read('f');
			let posY = fs.read('f') * 8192;

			let quaternion = new THREE.Quaternion(fs.read('f'), fs.read('f'), fs.read('f'), fs.read('f'));

			let sclX = fs.read('f');
			let sclZ = fs.read('f');
			let sclY = fs.read('f');

			opl.push({
				url: url, 
				pos: new THREE.Vector3(posX, posZ, posY), 
				rot: new THREE.Euler().setFromQuaternion(quaternion, 'XZY'), 
				scl: new THREE.Vector3(sclX, sclZ, sclY)
			});
		}

		onLoad({
			header, 
			opl
		});
	}
}
