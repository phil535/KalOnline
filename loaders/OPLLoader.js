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
		loader.load(url, function (text) {
			scope.parse(text, onLoad);
		}, onProgress, onError);
	},
	
	parse: function (data, onLoad) {

		var fs = new FileStream(data);

		var map = new THREE.Object3D();
		var loadIndex = 0;

		var loader = new THREE.GBLoader();

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

		function load () {
			loadIndex ++;

			var urlLength = fs.read('<I');

			var url = "";
			for (var i = 0; i < urlLength; i ++) {
				url = url + fs.read('<s');
			}
			url += ".gb";

			console.log(url);

			var pos = new THREE.Vector3(fs.read('<f') * 8192, fs.read('<f') * 8192, fs.read('<f')/10000000);
			var rot = new THREE.Quaternion(fs.read('<f'), fs.read('<f'), fs.read('<f'), fs.read('<f'));
			var scl = new THREE.Vector3(fs.read('<f'), fs.read('<f'), fs.read('<f'));

			loader.load(url, function (geometry, materials) {
				var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));

				mesh.position.set(pos.x, pos.z, pos.y);
				mesh.rotation.setFromQuaternion(rot, "XZY");
				mesh.scale.copy(scl.x, scl.z, scl.z);

				map.add(mesh);

				if (loadIndex < header.objectCount) {
					load();
				}
				else {
					onLoad(map);
				}
			});
		}

		load();

	}
};
