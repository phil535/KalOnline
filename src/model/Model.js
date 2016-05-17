const MATRIX = new THREE.Matrix4();

export default class Model {
  constructor() {
    this.container = new THREE.Object3D();
  }
  // TODO
  // Figure out if loading takes less time when load functions are called in simultaniously
  async setGeometry(formation, gbBones) {
    let geometry = new THREE.Geometry();
    let materials = [];

    for (let piece of formation) {
      const {
        geometry: pieceGeometry,
        materials: pieceMaterials,
        boneFile
      } = await piece.load();

      if (this.boneFile === undefined) {
        this.boneFile = boneFile;
      }

      geometry.merge(pieceGeometry, MATRIX, materials.length);
      materials.push(...pieceMaterials);

      geometry.skinWeights.push(...pieceGeometry.skinWeights);
      geometry.skinIndices.push(...pieceGeometry.skinIndices);
    }

    let material = new THREE.MeshFaceMaterial(materials);

    let mesh;
    if (gbBones !== undefined) {
      let {geometry: {bones}} = await gbBones.load();

      geometry.bones = bones;

      for (let material of materials) {
        material.skinning = true;
      }

      mesh = new THREE.SkinnedMesh(geometry, material);
    }
    else {
      mesh = new THREE.Mesh(geometry, material);
    }

    if (this.animation !== undefined) {
      let animation = new THREE.Animation(mesh, this.animation.data);
      animation.timeScale = this.animation.timeScale;
      animation.play(this.animation.currentTime);
      this.animation = animation;
    }

    if (this.mesh !== undefined) {
      this.mesh.geometry.dispose();
      this.container.remove(this.mesh);
    }
    this.mesh = mesh;
    this.container.add(this.mesh);
  }
  async setAnimation(gbObject) {
    let {geometry: {animation}} = await gbObject.load();

    if (this.mesh) {
      this.animation = new THREE.Animation(this.mesh, animation);
      this.animation.play(0);
    }
    else {
      this.animation = {
        data: animation,
        currentTime: 0,
        timeScale: 1
      };
    }
  }
}
