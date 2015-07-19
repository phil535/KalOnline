
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

function geometryBinaryConverter (fs) {
	"use strict";
	
	//HEADER COMPLETE
	var header = (function () {
		var header = {
			version: fs.read('<B'),
			boneCount: fs.read('<B'),
			isBoneFile: Boolean(fs.read('<B')),
			geometryCount: fs.read('<B')
		};

		if (header.version >= 10) {
			header.crc32 = fs.read('<I');
		}

		if (header.version >= 12) {
			var fileName = '';
			for (var i = 0; i < 64; i ++) {
				fileName = fileName + fs.read('<s');
			}
			header.fileName = fileName;
		}

		var fileNameLength = fs.read('<I');

		var verticesCount = [];
		for (var i = 0; i < ((header.version >= 9) ? 12 : 6); i ++) {
			verticesCount.push(fs.read('<H'));
		}

		header.indexCount = fs.read('<H');
		header.boneIndexCount = fs.read('<H');
		header.keyFrameCount = fs.read('<H');
		header.unknown0 = fs.read('<H');

		if (header.version === 8) {
			header.descriptorSize = fs.read('<H');
			header.collisionSize = fs.read('<H');
		}
		else {
			header.descriptorSize = fs.read('<I');
			header.collisionSize = fs.read('<I');
		}

		header.transformationCount = fs.read('<H');

		if (header.version === 8) {
			header.animationCount = fs.read('<B');
		}
		else {
			header.animationCount = fs.read('<H');
		}

		header.materialCount = fs.read('<H');
		header.unknown1 = fs.read('<H');

		if (header.version >= 11) {
			header.boundingBoxMin = new THREE.Vector3(fs.read('<f'), fs.read('<f'), fs.read('<f'));
			header.boundingBoxMax = new THREE.Vector3(fs.read('<f'), fs.read('<f'), fs.read('<f'));
		}

		if (header.version >= 9) {
			header.boundingSphereCenter = new THREE.Vector3(fs.read('<f'), fs.read('<f'), fs.read('<f'));
			header.boundingSphereRadius = fs.read('<f');
		}

		return header;
	})();

	if (header.version < 8 || header.version > 12) {
		return {
			"metadata": {
				"generator": "cappieh - Phanthom SwordScript GB Converter",
				"gbVersion": header.version,
				"succes": false,
				"error": 'Only versions 8 through 12 are supported',
				"header": header
			}
		};
	}

	//BONES COMPLETE
	if (header.isBoneFile == 1) {
		var bones = (function () {
			var bones = [];	
			var parentBones = [];

			for (var i = 0; i < header.boneCount; i ++) {
				var n11 = fs.read('<f'), n21 = fs.read('<f'), n31 = fs.read('<f'), n41 = fs.read('<f'),
				n12 = fs.read('<f'), n22 = fs.read('<f'), n32 = fs.read('<f'), n42 = fs.read('<f'),
				n13 = fs.read('<f'), n23 = fs.read('<f'), n33 = fs.read('<f'), n43 = fs.read('<f'),
				n14 = fs.read('<f'), n24 = fs.read('<f'), n34 = fs.read('<f'), n44 = fs.read('<f');


				var m = new THREE.Matrix4().set(
					n11, n12, n13, n14,
					n21, n22, n23, n24,
					n31, n32, n33, n34,
					n41, n42, n43, n44
				);
				m = new THREE.Matrix4().getInverse(m);

				parentBones.push(m);
				
				var parent = fs.read('<B');
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
		})();
	}

	//MATERIALS COMPLETE
	if (header.materialCount > 0) {
		var materials = (function () {
			var materials = [];
			for (var i = 0; i < header.materialCount; i ++) {
				var material = (function () {
					return {
						textureNameOffset: fs.read('<I'),
						textureMapOption: fs.read('<H'),
						textureNameLength: fs.read('<I'),
						overlayOffset: fs.read('<I'),
						materialOffset: fs.read('<I')
					};
				})();
				materials.push(material);
			}
			return materials;
		})();
	}

	//GEOMETRY COMPLETE
	if (header.geometryCount > 0 && header.indexCount > 0) {
		var geometries = [];
		for (var i = 0; i < header.geometryCount; i ++) {
			var geometry = (function () {
				var triangleList = 0;
				var triangleStrip = 1;

				var geometry = {
					vertices: [],
					faces: [],
					uvs: [],
					skinIndices: [],
					skinWeights: [],
					nameOffset: fs.read('<I'),
					materialIndex: fs.read('<I')
				};

				var vertexFormat = fs.read('<B');
				var primitiveType = fs.read('<B');
				var vertexCount = fs.read('<H');
				var faceIndexCount = fs.read('<H');
				var boneIndexCount = fs.read('<B');

				var boneLookup = [];
				for (var i = 0; i < boneIndexCount; i ++) {
					boneLookup.push(fs.read('<B'));
				}

				for (var i = 0; i < vertexCount; i ++) {
					var vX = fs.read('<f');
					var vY = fs.read('<f');
					var vZ = fs.read('<f');

					var pos = new THREE.Vector3(vX, vY, vZ);//.applyMatrix4(rotationMatrix);
					geometry.vertices.push(pos.x, pos.y, pos.z);

					if (vertexFormat === 0 && boneIndexCount > 0) {
						var vertexWeight = 1 / header.geometryCount;
						if (vertexWeight > 0.25) {
							geometry.skinWeights.push(vertexWeight);
							geometry.skinIndices.push(boneLookup[0]);
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
							var vertexWeight = fs.read('<f');
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

							geometry.skinWeights.push(vertexWeights[0]);


							var vertexGroups = [fs.read('<B'), fs.read('<B'), fs.read('<B'), fs.read('<B')];
							geometry.skinIndices.push(boneLookup[vertexGroups[0]]);
						}
						else {
							geometry.skinIndices.push(0);
							geometry.skinWeights.push(0);
						}
					}

					//console.log(geometry.skinWeights);

					//wat is dit??
					var no = [fs.read('<f'), fs.read('<f'), fs.read('<f')];

					var uvX = fs.read('<f');
					var uvY = 1 - fs.read('<f');
					geometry.uvs.push(uvX, uvY);

					if (vertexFormat > 5) {
						//console.log(file, vertexFormat, vertexCount);
						fs.position += ((vertexFormat % 6) * 4) + 8;
					}
				}

				if (primitiveType === triangleList) {
					for (var i = 0; i < faceIndexCount; i += 3) {
						var faceA = fs.read('<H');
						var faceB = fs.read('<H');
						var faceC = fs.read('<H');
						geometry.faces.push(faceA, faceB, faceC);
					}
				}
				else if (primitiveType === triangleStrip) {
					var faceIndices = [fs.read('<H'), fs.read('<H')];

					for (var i = 2; i < faceIndexCount; i ++) {
						faceIndices.push(fs.read('<H'));

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
							geometry.faces.push(
								faceIndicesCopy[0],
								faceIndicesCopy[1],
								faceIndicesCopy[2]
							);

							/*face = self.innerMesh.faces[-1]
							face.uv = [vertex.uvco for vertex in faceVertices]*/
						}
						faceIndices.shift();
					}
				}

				return geometry;
			})();
			geometries.push(geometry);
		}
	}

	//ANIMATION TODO
	if (header.animationCount > 0 && header.keyFrameCount > 0) {
		var animation = (function () {

			var hierarchy = [];

			for (var i = 0; i < header.boneCount; i ++) {
				hierarchy.push({"keys": [], "parent": i - 1});
			}

			for (var i = 0; i < header.animationCount; i ++) {
				var index = fs.read('<I');
				var keyFrameCount = fs.read('<H');

				for (var j = 0; j < keyFrameCount; j ++) {
					var keyFrameDuration = fs.read('<H');
					var animationIndex = fs.read('<I');

					//if (animationIndex == index) {
						var keyFrameDuration = Math.max(keyFrameDuration / 1000.0, 0);

						for (var k = 0; k < hierarchy.length; k ++) {
							hierarchy[k]["keys"][j] = {"time": keyFrameDuration};
						}
					//}
				}
			}

			var boneLookup = [];
			for (var i = 0; i < keyFrameCount; i ++) {
				for (var j = 0; j < header.boneCount; j ++) {
					boneLookup.push(fs.read('<H'));
				}
			}

			var transformations = [];
			for (var i = 0; i < header.transformationCount; i ++) {
				var translation = new THREE.Vector3(fs.read('<f'), fs.read('<f'), fs.read('<f'));
				var rotation = new THREE.Quaternion(fs.read('<f'), fs.read('<f'), fs.read('<f'), fs.read('<f'));
				var scale = new THREE.Vector3(fs.read('<f'), fs.read('<f'), fs.read('<f'));

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
		})();
	}

	//COLLISION MESH TODO
	if (header.collisionSize > 0) {
		var collisionGeometry = (function () {
			//fix something here
			if (fs.position !== fs.size - header.descriptorSize - header.collisionSize) {
				console.warn("error 'file stream is at incorrect position at collision' in file: " + file);
			}

			fs.position = fs.size - header.descriptorSize - header.collisionSize;

			var geometry = {
				vertices: [],
				faces: []
			};

			var vertexCount = fs.read('<H');
			var faceIndexCount = fs.read('<H');

			var boundingBoxMin = new THREE.Vector3(fs.read('<f'), fs.read('<f'), fs.read('<f'));
			var boundingBoxMax = new THREE.Vector3(fs.read('<f'), fs.read('<f'), fs.read('<f'));

			var delta = boundingBoxMax.sub(boundingBoxMin).multiplyScalar(0xffff);

			for (var i = 0; i < vertexCount; i ++) {
				var vertex = new THREE.Vector3(fs.read('<f'), fs.read('<f'), fs.read('<f'))
					.multiply(delta)
					.add(boundingBoxMin);

				geometry.vertices.push(vertex.x, vertex.y, vertex.z);
			}

			for (var i = 0; i < faceIndexCount; i ++) {
				geometry.faces.push(fs.read('<H'), fs.read('<H'), fs.read('<H'));
			}

			return geometry;
		})();
	}

	//COMPLETE
	if (materials !== undefined) {
		(function () {
			var oldPosition = fs.size - header.descriptorSize;
			fs.position = oldPosition;

			var str = '';
			for (var i = 0; i < header.descriptorSize; i ++) {
				str += fs.read('<s');
			}

			for (var i = 0; i < materials.length; i ++) {
				var material = materials[i];

				fs.position = oldPosition + material.materialOffset;

				material.colorAmbient = [fs.read('<B')/255, fs.read('<B')/255, fs.read('<B')/255];
				fs.position += 1;
				material.colorDiffuse = [fs.read('<B')/255, fs.read('<B')/255, fs.read('<B')/255];
				fs.position += 1;
				material.colorSpecular = [fs.read('<B')/255, fs.read('<B')/255, fs.read('<B')/255];
				fs.position += 1;
				material.mapDiffuseAnisotropy = fs.read('<f');

				fs.position = material.textureNameOffset + oldPosition;
				var textureName = '';
				while (true) {
					var s = fs.read('<s');
					if (s === String.fromCharCode(0)) {
						break;
					}
					else {
						textureName = textureName + s;
					}
				}
				textureName = textureName.slice(0, -3) + 'png';
				material.mapDiffuse = textureName;
			}
		})();
	}

	//CREATE DATA
	return (function () {
		if (header.isBoneFile) {
			var type = "Bone";
		}
		else if (header.animationCount > 0) {
			var type = "Animation";
		}
		else {
			var type = "Geometry";
		}

		var data = {
			"metadata": {
				"generator": "cappieh - Phanthom SwordScript GB Converter",
				"gbVersion": header.version,
				"succes": true,
				"formatVersion": 3,
				"type": type
			}
		};

		if (geometries) {
			var vertices = [];
			var faces = [];
			var uvs = [];
			var skinWeights = [];
			var skinIndices = [];

			for (var i = 0; i < geometries.length; i ++) {
				var geometry = geometries[i];
				var faceOffset = vertices.length/3;

				for (var j = 0; j < geometry.faces.length; j += 3) {
					faces.push(
						10,
						geometry.faces[j] + faceOffset,
						geometry.faces[j + 1] + faceOffset,
						geometry.faces[j + 2] + faceOffset,
						geometry.materialIndex,
						geometry.faces[j] + faceOffset,
						geometry.faces[j + 1] + faceOffset,
						geometry.faces[j + 2] + faceOffset
					);
				}

				vertices = vertices.concat(geometry.vertices);
				skinWeights = skinWeights.concat(geometry.skinWeights);
				skinIndices = skinIndices.concat(geometry.skinIndices);				
				uvs = uvs.concat(geometry.uvs);
				//uvs[geometry.materialIndex] = geometry.uvs;
			}

			data["faces"] = faces;
			data["vertices"] = vertices;
			data["uvs"] = [uvs];

			data["skinWeights"] = skinWeights;
			data["skinIndices"] = skinIndices;
			data["influencesPerVertex"] = 1;
		}
		else {
			data["faces"] = [];
			data["vertices"] = [];
		}

		if (collisionGeometry) {
			//data["collisionGeometry"] = collisionGeometry;
		}

		if (animation) {
			data["animation"] = animation;
		}

		if (bones) {
			data["bones"] = bones;
		}

		if (materials) {
			data["materials"] = [];

			for (var i = 0; i < materials.length; i ++) {
				var material = {
					"doubleSided": false, 
					"mapDiffuse": materials[i].mapDiffuse,
					"DbgIndex": i, 
					"mapDiffuseRepeat": [1, 1], 
					"wireframe": false, 
					"colorEmissive": [0.0, 0.0, 0.0], 
					"depthWrite": true, 
					"mapDiffuseAnisotropy": 1.0, 
					"shading": "basic", 
					"mapDiffuseWrap": ["RepeatWrapping", "RepeatWrapping"], 
					"blending": "NormalBlending", 
					"depthTest": true, 
					"colorAmbient": materials[i].colorAmbient, 
					"colorDiffuse": materials[i].colorDiffuse, 
					"visible": true, 
					"colorSpecular": materials[i].colorSpecular,
					"specularCoef": 50, 
					"transparent": false, 
					"opacity": 0.0
				};
				data["materials"].push(material);
			}
		}

		return data;
	})();
}
