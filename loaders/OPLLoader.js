THREE.OPLLoader = function (manager) {

	this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
};

THREE.OPLLoader.prototype = {

	constructor: THREE.OPLLoader,

	load: function (url, onLoad, onProgress, onError) {
		var scope = this;

		var loader = new THREE.XHRLoader(scope.manager);
		loader.setCrossOrigin(this.crossOrigin);
		loader.setResponseType('arraybuffer');
		loader.load(url, function (data) {
			scope.parse(data, onLoad);
		}, onProgress, onError);
	},
	
	parse: function (data, onLoad) {
		var fs = new FileStream(data);

		var header = {
			CRC32: fs.read('<I'), 
			unknown0: fs.read('<I'), 
			mapX: fs.read('<I'), 
			mapY: fs.read('<I'), 
			unknown1: fs.read('<I'), 
			unknown2: fs.read('<I'), 
			unknown3: fs.read('<I'), 
			unknown4: fs.read('<I'), 
			unknown5: fs.read('<I'), 
			objectCount: fs.read('<I')			
		};

		var opl = [];

		for (var i = 0; i < header.objectCount; i ++) {
			var urlLength = fs.read('<I');

			var url = fs.readString(urlLength) + '.gb';

			var posX = fs.read('<f') * 8192;
			var posZ = fs.read('<f');
			var posY = fs.read('<f') * 8192;

			var quaternion = new THREE.Quaternion(fs.read('<f'), fs.read('<f'), fs.read('<f'), fs.read('<f'));

			var sclX = fs.read('<f');
			var sclZ = fs.read('<f');
			var sclY = fs.read('<f');

			opl.push({
				url: url, 
				mapX: header.mapX, 
				mapY: header.mapY, 
				pos: new THREE.Vector3(posX, posZ, posY), 
				rot: new THREE.Euler().setFromQuaternion(quaternion, 'XZY'), 
				scl: new THREE.Vector3(sclX, sclZ, sclY)
			});
		}

		onLoad(opl);
	}
};
