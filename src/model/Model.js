export default class Model {
	constructor () {
		this.container = new THREE.Object3D();
	}

	createGeometry (formation, bones) {
		return new Promise ((resolve, reject) => {
			(async () => {
				let geometry = new THREE.Geometry();
				let materials = [];

				for (let piece of formation) {
					let {geometry: pieceGeometry, materials: pieceMaterials} = await piece.load();

					geometry.merge(pieceGeometry, new THREE.Matrix4(), materials.length);
					materials.push(...pieceMaterials);

					geometry.skinWeights.push(...pieceGeometry.skinWeights);
					geometry.skinIndices.push(...pieceGeometry.skinIndices);
				}

				let material = new THREE.MeshFaceMaterial(materials);

				let mesh;
				if (bones !== undefined) {
					let {geometry: {bones: pieceBone}} = await bones.load();

					geometry.bones = pieceBone;

					for (let material of materials) {
						material.skinning = true;
					}

					mesh = new THREE.SkinnedMesh(geometry, material);
				}
				else {
					mesh = new THREE.Mesh(geometry, material);
				}

				if (this.mesh !== undefined) {
					this.mesh.geometry.dispose();
					this.container.remove(this.mesh);
				}
				this.mesh = mesh;
				this.container.add(this.mesh);

				if (this.animation) {
					let animation = new THREE.Animation(this.mesh, this.animation.data); 
					animation.timeScale = this.animation.timeScale;
					animation.play(this.animation.currentTime);
					this.animation = animation;
				}

				resolve(mesh);
			}());
		});
	}

	async setAnimation (gbObject) {
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
