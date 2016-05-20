// Original software SwordScript GB
// Ported to JavaScript by Casper Lamboo
//
// Copyright (c) 2007-2008 Peter S. Stevens
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import 'mrdoob/three.js';
import FileStream from 'src/utils/filestream.js';
import GTXLoader from './GTXLoader.js';

const GTX_LOADER = new GTXLoader();
const TRIANGLE_LIST = 0;
const TRIANGLE_STRIP = 1;
const MATRIX = new THREE.Matrix4();
const POS = new THREE.Vector3();
const ROTQ = new THREE.Quaternion();
const SCL = new THREE.Vector3();

export default class GBLoader {
  constructor(manager = THREE.DefaultLoadingManager) {
    this.manager = manager;
  }
  load(url, onLoad, onProgress, onError) {
    const loader = new THREE.XHRLoader(this.manager);
    // loader.setCrossOrigin(this.crossOrigin);
    loader.setResponseType('arraybuffer');
    loader.load(url, (text) => {
      this.parse(text, url, onLoad, onError);
    }, onProgress, onError);
  }
  parse(data, url, onLoad, onError) {
    const fs = new FileStream(data, true);

    const geometry = new THREE.Geometry();

    const header = this._readHeader(fs);

    if (header.version < 8 || header.version > 12) {
      onError('Only versions 8 through 12 are supported');
      return;
    }

    geometry.boundingBox = this._readBoundingBox(fs, header);
    geometry.boundingSphere = this._readBoundingSphere(fs, header);

    if (header.isBoneFile) {
      geometry.bones = this._readBones(fs, header);
    }

    const materials = this._readMaterials(fs, header, url);

    for (let i = 0; i < header.geometryCount; i ++) {
      this._readGeometry(fs, header, geometry);
    }

    if (header.animationCount > 0 && header.keyFrameCount > 0) {
      geometry.animation = this._readAnimation(fs, header);
    }

    if (header.collisionSize > 0) {
      this._readCollision(fs, header);
    }

    onLoad({ geometry, materials });
  }
  _readHeader(fs) {
    const header = {
      version: fs.read('B'),
      boneCount: fs.read('B'),
      isBoneFile: Boolean(fs.read('B')),
      geometryCount: fs.read('B')
    }

    if (header.version >= 10) {
      header.crc32 = fs.read('I');
    }

    if (header.version >= 12) {
      const fileName = fs.readString(64);
      header.fileName = fileName; // NOTUSED
    }

    const fileNameLength = fs.read('I'); // NOTUSED

    const verticesCount = []; // NOTUSED
    for (let i = 0; i < ((header.version >= 9) ? 12 : 6); i ++) {
      verticesCount.push(fs.read('H'));
    }

    header.indexCount = fs.read('H'); // NOTUSED
    header.boneIndexCount = fs.read('H');
    header.keyFrameCount = fs.read('H');
    header.boneFile = fs.read('H'); // NOTUSED

    if (header.version === 8) {
      header.descriptorSize = fs.read('H');
      header.collisionSize = fs.read('H');
    } else {
      header.descriptorSize = fs.read('I');
      header.collisionSize = fs.read('I');
    }

    header.transformationCount = fs.read('H');

    if (header.version === 8) {
      header.animationCount = fs.read('B');
    } else {
      header.animationCount = fs.read('H');
    }

    header.materialCount = fs.read('H');
    header.unknown1 = fs.read('H'); // NOTUSED

    return header;
  }
  _readBoundingBox(fs, header) {
    let boundingBox;
    if (header.version >= 11) {
      boundingBox = new THREE.Box3()
      boundingBox.min.set(fs.read('f'), fs.read('f'), fs.read('f'));
      boundingBox.max.set(fs.read('f'), fs.read('f'), fs.read('f'));
    }
    return boundingBox;
  }
  _readBoundingSphere(fs, header) {
    let boundingSphere;
    if (header.version >= 9) {
      boundingSphere = new THREE.Sphere();
      boundingSphere.center.set(fs.read('f'), fs.read('f'), fs.read('f'));
      boundingSphere.radius = fs.read('f');
    }
    return boundingSphere;
  }
  _readBones(fs, header) {
    const bones = [];
    const parentBones = [];

    for (let i = 0; i < header.boneCount; i ++) {
      const n11 = fs.read('f'), n21 = fs.read('f'), n31 = fs.read('f'), n41 = fs.read('f'),
      n12 = fs.read('f'), n22 = fs.read('f'), n32 = fs.read('f'), n42 = fs.read('f'),
      n13 = fs.read('f'), n23 = fs.read('f'), n33 = fs.read('f'), n43 = fs.read('f'),
      n14 = fs.read('f'), n24 = fs.read('f'), n34 = fs.read('f'), n44 = fs.read('f');

      const m = MATRIX.set(
        n11, n12, n13, n14,
        n21, n22, n23, n24,
        n31, n32, n33, n34,
        n41, n42, n43, n44
      );

      parentBones.push(m.clone());

      m.getInverse(m);

      let parent = fs.read('B');
      if (parent === 255) {
        parent = -1;
      } else {
        m.multiplyMatrices(parentBones[parent], m);
      }

      m.decompose(POS, ROTQ, SCL);

      let pos = POS.toArray();
      let rotq = ROTQ.toArray();
      let scl = SCL.toArray();
      bones.push({ parent, pos, rotq, scl });
    }

    return bones;
  }
  _readMaterials(fs, header, url) {
    const materials = [];

    for (let i = 0; i < header.materialCount; i ++) {
      const materialData = {
        textureNameOffset: fs.read('I'),
        textureMapOption: fs.read('H'),
        textureNameLength: fs.read('I'),
        overlayOffset: fs.read('I'),
        materialOffset: fs.read('I')
      };

      const material = this._readMaterial(fs, header, url, materialData);
      materials.push(material);
    }

    return materials;
  }
  _readMaterial(fs, header, url, materialData) {
    const currentPosition = fs.position;

    const material = new THREE.MeshBasicMaterial({
      // wireframe: true,
      // color: 0xffffff
    });

    fs.position = fs.size - header.descriptorSize + materialData.materialOffset;

    const colorAmbient = [fs.read('B') / 255, fs.read('B') / 255, fs.read('B') / 255, fs.read('B') / 255]; // NOTUSED
    const colorDiffuse = [fs.read('B') / 255, fs.read('B') / 255, fs.read('B') / 255, fs.read('B') / 255]; // NOTUSED
    const colorSpecular = [fs.read('B') / 255, fs.read('B') / 255, fs.read('B') / 255, fs.read('B') / 255]; // NOTUSED
    const mapDiffuseAnisotropy = fs.read('f'); // NOTUSED

    fs.position = fs.size - header.descriptorSize + materialData.textureNameOffset;

    let textureNameLength;
    if (materialData.textureNameLength === 0 || fs.position + materialData.textureNameLength > fs.size) {
      textureNameLength = fs.size - fs.position;
    } else {
      textureNameLength = materialData.textureNameLength;
    }

    const basePath = url.slice(0, Math.max(url.lastIndexOf('\\'), url.lastIndexOf('/'))) + '/tex/';
    let fileName = fs.readString(textureNameLength);
    fileName = fileName.slice(0, fileName.lastIndexOf('.')) + '.gtx';
    const textureUrl = basePath + fileName;

    const map = GTX_LOADER.load(textureUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    material.map = map;

    fs.position = currentPosition;

    return material;
  }
  _readGeometry(fs, header, geometry) {
    const nameOffset = fs.read('I'); // NOTUSED
    const materialIndex = fs.read('I');
    const vertexFormat = fs.read('B');
    const primitiveType = fs.read('B');
    const vertexCount = fs.read('H');
    const faceIndexCount = fs.read('H');
    const boneIndexCount = fs.read('B');
    const faceOffset = geometry.vertices.length;

    const boneLookup = [];
    for (let i = 0; i < boneIndexCount; i ++) {
      boneLookup.push(fs.read('B'));
    }

    const uvs = [];

    for (let i = 0; i < vertexCount; i ++) {
      const pos = new THREE.Vector3(fs.read('f'), fs.read('f'), fs.read('f'));
      geometry.vertices.push(pos);

      if (vertexFormat === 0 && boneIndexCount > 0) {
        const vertexWeight = 1 / header.geometryCount;
        if (vertexWeight > 0.25) {
          geometry.skinWeights.push(new THREE.Vector4(vertexWeight, 0, 0, 0));
          geometry.skinIndices.push(new THREE.Vector4(boneLookup[0], 0, 0, 0));
        }
      } else if (vertexFormat > 0 && vertexFormat < 6) {
        let vertexWeightCount = (header.version > 10) ? (vertexFormat - 1) : (vertexFormat - 2);

        if (boneIndexCount === 0) {
          vertexWeightCount -= 3;
        }

        const vertexWeights = [];

        if (vertexWeightCount === 0) {
          vertexWeights[0] = 1.0;
        }

        let sum = 0;
        for (let j = 0; j < vertexWeightCount; j ++) {
          const vertexWeight = fs.read('f');
          if (vertexWeight > 0) {
            sum += vertexWeight;
            vertexWeights.push(vertexWeight);
          }
        }

        if (vertexWeights.length > 0) {
          const difference = 1.0 - sum;
          if (difference > 0.0) {
            vertexWeights.push(difference);
          }

          geometry.skinWeights.push(new THREE.Vector4(vertexWeights[0], 0, 0, 0));

          const vertexGroups = [fs.read('B'), fs.read('B'), fs.read('B'), fs.read('B')];
          geometry.skinIndices.push(new THREE.Vector4(boneLookup[vertexGroups[0]], 0, 0, 0));
        } else {
          geometry.skinIndices.push(new THREE.Vector4(0, 0, 0, 0));
          geometry.skinWeights.push(new THREE.Vector4(0, 0, 0, 0));
        }
      }

      const no = [fs.read('f'), fs.read('f'), fs.read('f')]; // NOTUSED

      uvs.push(new THREE.Vector2(fs.read('f'), fs.read('f')));
      //geometry.faceVertexUvs.push(new THREE.Vector2(uvX, uvY));

      if (vertexFormat > 5) {
        fs.position += ((vertexFormat % 6) * 4) + 8;
      }
    }
    //geometry.faceVertexUvs = [geometry.faceVertexUvs];

    if (primitiveType === TRIANGLE_LIST) {
      for (let i = 0; i < faceIndexCount; i += 3) {
        const a = fs.read('H');
        const b = fs.read('H');
        const c = fs.read('H');

        const face = new THREE.Face3();
        face.a = a + faceOffset;
        face.b = b + faceOffset;
        face.c = c + faceOffset;
        face.materialIndex = materialIndex;
        geometry.faces.push(face);

        geometry.faceVertexUvs[0].push([uvs[a], uvs[b], uvs[c]]);
      }
    } else if (primitiveType === TRIANGLE_STRIP) {
      const faceIndices = [fs.read('H'), fs.read('H')];

      for (let i = 2; i < faceIndexCount; i ++) {
        faceIndices.push(fs.read('H'));

        let faceIndicesCopy;
        if (i % 2 === 0) {
          faceIndicesCopy = [...faceIndices];
        } else {
          faceIndicesCopy = [...faceIndices].reverse();
        }

        const isDegenerateA = faceIndicesCopy[0] !== faceIndicesCopy[1];
        const isDegenerateB = faceIndicesCopy[0] !== faceIndicesCopy[2];
        const isDegenerateC = faceIndicesCopy[1] !== faceIndicesCopy[2];

        if (isDegenerateA && isDegenerateB && isDegenerateC) {
          const a = faceIndicesCopy[0];
          const b = faceIndicesCopy[1];
          const c = faceIndicesCopy[2];

          const face = new THREE.Face3();
          face.a = a + faceOffset;
          face.b = b + faceOffset;
          face.c = c + faceOffset;
          face.materialIndex = materialIndex;
          geometry.faces.push(face);

          geometry.faceVertexUvs[0].push([uvs[a], uvs[b], uvs[c]]);
        }
        faceIndices.shift();
      }
    }
  }
  _readAnimation(fs, header) {
    let keyFrameCount;
    let keyFrameDuration;
    const hierarchy = [];

    for (let i = 0; i < header.boneCount; i ++) {
      hierarchy.push({ keys: [], parent: i - 1});
    }

    for (let i = 0; i < header.animationCount; i ++) {
      const index = fs.read('I');
      keyFrameCount = fs.read('H');

      for (let j = 0; j < keyFrameCount; j ++) {
        keyFrameDuration = fs.read('H');
        const animationIndex = fs.read('I');

        // This check is in original code, has to be implemented in some way
        // if (animationIndex == index) {
          keyFrameDuration = Math.max(keyFrameDuration / 1000.0, 0);

          for (let k = 0; k < hierarchy.length; k ++) {
            hierarchy[k].keys[j] = { time: keyFrameDuration };
          }
        // }
      }
    }

    // console.log(JSON.parse(JSON.stringify(hierarchy)));

    const boneLookup = [];
    for (let i = 0; i < keyFrameCount; i ++) {
      for (let j = 0; j < header.boneCount; j ++) {
        boneLookup.push(fs.read('H'));
      }
    }

    const transformations = [];
    for (let i = 0; i < header.transformationCount; i ++) {
      const translation = new THREE.Vector3(fs.read('f'), fs.read('f'), fs.read('f'));
      const rotation = new THREE.Quaternion(fs.read('f'), fs.read('f'), fs.read('f'), fs.read('f'));
      const scale = new THREE.Vector3(fs.read('f'), fs.read('f'), fs.read('f'));

      transformations.push(new THREE.Matrix4().compose(translation, rotation, scale));
    }

    for (let j = 0; j < header.boneCount; j ++) {
      for (let i = 0; i < keyFrameCount; i ++) {
        const localMatrix = transformations[boneLookup[i * header.boneCount + j]].clone();

        const translation = new THREE.Vector3();
        const rotation = new THREE.Quaternion();
        const scale = new THREE.Vector3();

        localMatrix.decompose(translation, rotation, scale);

        hierarchy[j].keys[i].pos = translation.toArray();
        hierarchy[j].keys[i].rot = rotation.toArray();
        hierarchy[j].keys[i].scl = scale.toArray();
      }
    }

    return {
      hierarchy: hierarchy,
      fps: 30,
      name: 'namehere',
      length: keyFrameDuration
    };
  }
  _readCollision(fs, header) {
    //fix something here
    if (fs.position !== fs.size - header.descriptorSize - header.collisionSize) {
      console.warn('error "file stream is at incorrect position at collision"');
      return;
    }

    fs.position = fs.size - header.descriptorSize - header.collisionSize;

    const geometry = {
      vertices: [],
      faces: []
    };

    const vertexCount = fs.read('H');
    const faceIndexCount = fs.read('H');

    const boundingBoxMin = new THREE.Vector3(fs.read('f'), fs.read('f'), fs.read('f'));
    const boundingBoxMax = new THREE.Vector3(fs.read('f'), fs.read('f'), fs.read('f'));

    const delta = boundingBoxMax.sub(boundingBoxMin).multiplyScalar(0xffff);

    for (let i = 0; i < vertexCount; i ++) {
      const vertex = new THREE.Vector3(fs.read('f'), fs.read('f'), fs.read('f'))
        .multiply(delta)
        .add(boundingBoxMin);

      geometry.vertices.push(vertex.x, vertex.y, vertex.z);
    }

    for (let i = 0; i < faceIndexCount; i ++) {
      geometry.faces.push(fs.read('f'), fs.read('f'), fs.read('f'));
    }

    return geometry;
  }
}
