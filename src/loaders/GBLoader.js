/*
* Original software SwordScript GB
* Ported to JavaScript by Casper Lamboo
* 
* Copyright (c) 2007-2008 Peter S. Stevens
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/
import 'mrdoob/three.js';
import FileStream from 'casperlamboo/filestream';
import GTXLoader from './GTXLoader.js';

export default class GBLoader {

	constructor (manager = THREE.DefaultLoadingManager) {

		this.manager = manager;
	}

	load (url, onLoad, onProgress, onError) {
		var loader = new THREE.XHRLoader(this.manager);
		loader.setCrossOrigin(this.crossOrigin);
		loader.setResponseType('arraybuffer');
		loader.load(url, (text) => {
			this.parse(text, url, onLoad, onError);
		}, onProgress, onError);
	}
	
	parse (data, url, onLoad, onError) {
		var fs = new FileStream(data, true);

		//var geometry = new THREE.BufferGeometry();
		var geometry = new THREE.Geometry();

		var header = this._readHeader(fs);

		if (header.version < 8 || header.version > 12) {
			if (onError !== undefined) {
				onError('Only versions 8 through 12 are supported');
			}
			return;
		}

		geometry.boundingBox = this._readBoundingBox(fs, header);
		geometry.boundingSphere = this._readBoundingSphere(fs, header);

		if (header.isBoneFile) {
			geometry.bones = this._readBones(fs, header);
		}

		var materials = this._readMaterials(fs, header, url);

		for (var i = 0; i < header.geometryCount; i ++) {
			this._readGeometry(fs, header, geometry);
		}

		if (header.animationCount > 0 && header.keyFrameCount > 0) {
			geometry.animation = this._readAnimation(fs, header);
		}

		if (header.collisionSize > 0) {
			this._readCollision(fs, header);
		}

		if (onLoad !== undefined) {
			onLoad(geometry, materials);
		}
	}

	_readHeader (fs) {
		var header = {
			version: fs.read('B'),
			boneCount: fs.read('B'),
			isBoneFile: Boolean(fs.read('B')),
			geometryCount: fs.read('B')
		}

		if (header.version >= 10) {
			header.crc32 = fs.read('I');
		}

		if (header.version >= 12) {
			var fileName = fs.readString(64);
			header.fileName = fileName;
		}

		var fileNameLength = fs.read('I');

		var verticesCount = [];
		for (var i = 0; i < ((header.version >= 9) ? 12 : 6); i ++) {
			verticesCount.push(fs.read('H'));
		}

		header.indexCount = fs.read('H');
		header.boneIndexCount = fs.read('H');
		header.keyFrameCount = fs.read('H');
		header.unknown0 = fs.read('H');

		if (header.version === 8) {
			header.descriptorSize = fs.read('H');
			header.collisionSize = fs.read('H');
		}
		else {
			header.descriptorSize = fs.read('I');
			header.collisionSize = fs.read('I');
		}

		header.transformationCount = fs.read('H');

		if (header.version === 8) {
			header.animationCount = fs.read('B');
		}
		else {
			header.animationCount = fs.read('H');
		}

		header.materialCount = fs.read('H');
		header.unknown1 = fs.read('H');

		return header;
	}

	_readBoundingBox (fs, header) {
		var boundingBox = new THREE.Box3();

		if (header.version >= 11) {
			boundingBox.min.x = fs.read('f');
			boundingBox.min.y = fs.read('f');
			boundingBox.min.z = fs.read('f');

			boundingBox.max.x = fs.read('f');
			boundingBox.max.y = fs.read('f');
			boundingBox.max.z = fs.read('f');
		}

		return boundingBox;
	}

	_readBoundingSphere (fs, header) {
		var boundingSphere = new THREE.Sphere();

		if (header.version >= 9) {
			boundingSphere.center.x = fs.read('f');
			boundingSphere.center.y = fs.read('f');
			boundingSphere.center.z = fs.read('f');

			boundingSphere.radius = fs.read('f');
		}

		return boundingSphere;
	}

	_readBones (fs, header) {
		var bones = [];	
		var parentBones = [];

		for (var i = 0; i < header.boneCount; i ++) {
			var n11 = fs.read('f'), n21 = fs.read('f'), n31 = fs.read('f'), n41 = fs.read('f'),
			n12 = fs.read('f'), n22 = fs.read('f'), n32 = fs.read('f'), n42 = fs.read('f'),
			n13 = fs.read('f'), n23 = fs.read('f'), n33 = fs.read('f'), n43 = fs.read('f'),
			n14 = fs.read('f'), n24 = fs.read('f'), n34 = fs.read('f'), n44 = fs.read('f');

			var m = new THREE.Matrix4().set(
				n11, n12, n13, n14,
				n21, n22, n23, n24,
				n31, n32, n33, n34,
				n41, n42, n43, n44
			);
			m = new THREE.Matrix4().getInverse(m);

			parentBones.push(m);
			
			var parent = fs.read('B');
			if (parent === 255) {
				parent = -1;
			}
			else {
				m = new THREE.Matrix4().getInverse(parentBones[parent]).multiply(m);
			}

			var pos = new THREE.Vector3();
			var rot = new THREE.Quaternion();
			var scl = new THREE.Vector3();

			m.decompose(pos, rot, scl);

			bones.push({
				"pos": pos.toArray(),
				"parent": parent,
				"rotq": rot.toArray(),
				"scl": scl.toArray()
			});
		}
		return bones;
	}

	_readMaterials (fs, header, url) {
		var materials = [];

		for (var i = 0; i < header.materialCount; i ++) {
			var materialData = {
				textureNameOffset: fs.read('I'),
				textureMapOption: fs.read('H'),
				textureNameLength: fs.read('I'),
				overlayOffset: fs.read('I'),
				materialOffset: fs.read('I')
			};

			var material = this._readMaterial(fs, header, url, materialData);
			materials.push(material);
		}

		return materials;
	}

	_readMaterial (fs, header, url, materialData) {
		var currentPosition = fs.position;

		var material = new THREE.MeshBasicMaterial();
		// material.skinning = true;

		fs.position = fs.size - header.descriptorSize + materialData.materialOffset;

		var colorAmbient = [fs.read('B') / 255, fs.read('B') / 255, fs.read('B') / 255];
		fs.position += 1;
		var colorDiffuse = [fs.read('B') / 255, fs.read('B') / 255, fs.read('B') / 255];
		fs.position += 1;
		var colorSpecular = [fs.read('B') / 255, fs.read('B') / 255, fs.read('B') / 255];
		fs.position += 1;
		var mapDiffuseAnisotropy = fs.read('f');

		fs.position = fs.size - header.descriptorSize + materialData.textureNameOffset;
		
		var path = url.slice(0, Math.max(url.lastIndexOf('\\'), url.lastIndexOf('/')));
		var textureName = path + '/tex/';
		//for (var j = 0; j < materialData.textureNameLength; j ++) {
		while (true) {
			var s = fs.read('s');
			if (s === String.fromCharCode(0)) {
				break;
			}
			else {
				textureName += s;
			}
		}
		textureName = textureName.slice(0, textureName.lastIndexOf('.')) + '.gtx';

		//var map = THREE.ImageUtils.loadTexture(textureName);

		try {
			var loader = new GTXLoader();
			var map = loader.load(textureName);
			map.wrapS = map.wrapT = THREE.RepeatWrapping;
			material.map = map;
		}
		catch (error) {
			console.warn(error);
		}

		fs.position = currentPosition;

		return material;
	}

	_readGeometry (fs, header, geometry) {
		var triangleList = 0;
		var triangleStrip = 1;

		var nameOffset = fs.read('I');
		var materialIndex = fs.read('I');
		var vertexFormat = fs.read('B');
		var primitiveType = fs.read('B');
		var vertexCount = fs.read('H');
		var faceIndexCount = fs.read('H');
		var boneIndexCount = fs.read('B');
		var faceOffset = geometry.vertices.length;

		var boneLookup = [];
		for (var i = 0; i < boneIndexCount; i ++) {
			boneLookup.push(fs.read('B'));
		}

		var uvs = [];

		for (var i = 0; i < vertexCount; i ++) {
			var pos = new THREE.Vector3(fs.read('f'), fs.read('f'), fs.read('f'));
			geometry.vertices.push(pos);

			if (vertexFormat === 0 && boneIndexCount > 0) {
				var vertexWeight = 1 / header.geometryCount;
				if (vertexWeight > 0.25) {
					geometry.skinWeights.push(new THREE.Vector4(vertexWeight, 0, 0, 0));
					geometry.skinIndices.push(new THREE.Vector4(boneLookup[0], 0, 0, 0));
				}
			}
			else if (vertexFormat > 0 && vertexFormat < 6) {
				var vertexWeightCount = (header.version > 10) ? (vertexFormat - 1) : (vertexFormat - 2);

				if (boneIndexCount === 0) {
					vertexWeightCount -= 3;
				}

				var vertexWeights = [];

				if (vertexWeightCount === 0) {
					vertexWeights[0] = 1.0;
				}

				var sum = 0;
				for (var j = 0; j < vertexWeightCount; j ++) {
					var vertexWeight = fs.read('f');
					if (vertexWeight > 0) {
						sum += vertexWeight;
						vertexWeights.push(vertexWeight);
					}
				}

				if (vertexWeights.length > 0) {
					var difference = 1.0 - sum;
					if (difference > 0.0) {
						vertexWeights.push(difference);
					}

					geometry.skinWeights.push(new THREE.Vector4(vertexWeights[0], 0, 0, 0));

					var vertexGroups = [fs.read('B'), fs.read('B'), fs.read('B'), fs.read('B')];
					geometry.skinIndices.push(new THREE.Vector4(boneLookup[vertexGroups[0]], 0, 0, 0));
				}
				else {
					geometry.skinIndices.push(new THREE.Vector4(0, 0, 0, 0));
					geometry.skinWeights.push(new THREE.Vector4(0, 0, 0, 0));
				}
			}

			var no = [fs.read('f'), fs.read('f'), fs.read('f')];

			var uvX = fs.read('f');
			var uvY = fs.read('f');
			uvs.push(new THREE.Vector2(uvX, uvY));
			//geometry.faceVertexUvs.push(new THREE.Vector2(uvX, uvY));

			if (vertexFormat > 5) {
				fs.position += ((vertexFormat % 6) * 4) + 8;
			}
		}
		//geometry.faceVertexUvs = [geometry.faceVertexUvs];

		if (primitiveType === triangleList) {
			for (var i = 0; i < faceIndexCount; i += 3) {
				var a = fs.read('H');
				var b = fs.read('H');
				var c = fs.read('H');

				var face = new THREE.Face3();
				face.a = a + faceOffset;
				face.b = b + faceOffset;
				face.c = c + faceOffset;
				face.materialIndex = materialIndex;
				geometry.faces.push(face);

		

				geometry.faceVertexUvs[0].push([
					uvs[a], 
					uvs[b], 
					uvs[c]
				]);
			}
		}
		else if (primitiveType === triangleStrip) {
			var faceIndices = [fs.read('H'), fs.read('H')];

			for (var i = 2; i < faceIndexCount; i ++) {
				faceIndices.push(fs.read('H'));

				var faceIndicesCopy = [];
				if (i % 2 === 0) {
					for (var j = 0; j < faceIndices.length; j ++) {
						faceIndicesCopy.push(faceIndices[j]);
					}
				}
				else {
					for (var j = faceIndices.length -1; j >= 0; j --) {
						faceIndicesCopy.push(faceIndices[j]);
					}
				}

				var isDegenerateA = faceIndicesCopy[0] !== faceIndicesCopy[1];
				var isDegenerateB = faceIndicesCopy[0] !== faceIndicesCopy[2];
				var isDegenerateC = faceIndicesCopy[1] !== faceIndicesCopy[2];

				if (isDegenerateA && isDegenerateB && isDegenerateC) {
					var a = faceIndicesCopy[0];
					var b = faceIndicesCopy[1];
					var c = faceIndicesCopy[2];

					var face = new THREE.Face3();
					face.a = a + faceOffset;
					face.b = b + faceOffset;
					face.c = c + faceOffset;
					face.materialIndex = materialIndex;
					geometry.faces.push(face);

					geometry.faceVertexUvs[0].push([
						uvs[a], 
						uvs[b], 
						uvs[c]
					]);
				}
				faceIndices.shift();
			}
		}
	}

	_readAnimation (fs, header) {
		var hierarchy = [];

		for (var i = 0; i < header.boneCount; i ++) {
			hierarchy.push({"keys": [], "parent": i - 1});
		}

		for (var i = 0; i < header.animationCount; i ++) {
			var index = fs.read('I');
			var keyFrameCount = fs.read('H');

			for (var j = 0; j < keyFrameCount; j ++) {
				var keyFrameDuration = fs.read('H');
				var animationIndex = fs.read('I');

				if (animationIndex == index) {
					var keyFrameDuration = Math.max(keyFrameDuration / 1000.0, 0);

					for (var k = 0; k < hierarchy.length; k ++) {
						hierarchy[k]["keys"][j] = {"time": keyFrameDuration};
					}
				}
			}
		}

		var boneLookup = [];
		for (var i = 0; i < keyFrameCount; i ++) {
			for (var j = 0; j < header.boneCount; j ++) {
				boneLookup.push(fs.read('H'));
			}
		}

		var transformations = [];
		for (var i = 0; i < header.transformationCount; i ++) {
			var translation = new THREE.Vector3(fs.read('f'), fs.read('f'), fs.read('f'));
			var rotation = new THREE.Quaternion(fs.read('f'), fs.read('f'), fs.read('f'), fs.read('f'));
			var scale = new THREE.Vector3(fs.read('f'), fs.read('f'), fs.read('f'));

			transformations.push(new THREE.Matrix4().compose(translation, rotation, scale));
		}

		for (var j = 0; j < header.boneCount; j ++) {
			for (var i = 0; i < keyFrameCount; i ++) {
				var localMatrix = transformations[boneLookup[i * header.boneCount + j]].clone();

				var translation = new THREE.Vector3();
				var rotation = new THREE.Quaternion();
				var scale = new THREE.Vector3();

				localMatrix.decompose(translation, rotation, scale);

				hierarchy[j]["keys"][i]["pos"] = translation.toArray();
				hierarchy[j]["keys"][i]["rot"] = rotation.toArray();
				hierarchy[j]["keys"][i]["scl"] = scale.toArray();
			}
		}

		return {
			"hierarchy": hierarchy,
			"fps": 30,
			"name": "namehere",
			"length": keyFrameDuration
		};
	}

	_readCollision (fs, header) {
		//fix something here
		if (fs.position !== fs.size - header.descriptorSize - header.collisionSize) {
			console.warn("error 'file stream is at incorrect position at collision' in file: " + file);
			return;
		}

		fs.position = fs.size - header.descriptorSize - header.collisionSize;

		var geometry = {
			vertices: [],
			faces: []
		};

		var vertexCount = fs.read('H');
		var faceIndexCount = fs.read('H');

		var boundingBoxMin = new THREE.Vector3(fs.read('f'), fs.read('f'), fs.read('f'));
		var boundingBoxMax = new THREE.Vector3(fs.read('f'), fs.read('f'), fs.read('f'));

		var delta = boundingBoxMax.sub(boundingBoxMin).multiplyScalar(0xffff);

		for (var i = 0; i < vertexCount; i ++) {
			var vertex = new THREE.Vector3(fs.read('f'), fs.read('f'), fs.read('f'))
				.multiply(delta)
				.add(boundingBoxMin);

			geometry.vertices.push(vertex.x, vertex.y, vertex.z);
		}

		for (var i = 0; i < faceIndexCount; i ++) {
			geometry.faces.push(fs.read('H'), fs.read('H'), fs.read('H'));
		}

		return geometry;
	}
}
