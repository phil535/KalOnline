import Model from './model.js';
import GBObject from './GBObject.js';
import 'mrdoob/three.js';

export default class Archer extends Model {
	constructor (formation = {a: 0, p: 0, g: 0, s: 0, f:1, h1: 0, h2: 1}) {
		super();

		this.formation = formation;
		this.setFormation(this.formation);
		this.setAnimation();
	}

	async setFormation (formation = {}) {
		for (let i in formation) {
			this.formation[i] = formation[i];
		}

		let {a, p, f, g, s, h1, h2} = this.formation;

		formation = [
			new GBObject(`../../DATA/Model/Clothes/Cm_${a}_a01.gb`), 
			new GBObject(`../../DATA/Model/Clothes/Cm_${p}_p01.gb`), 
			new GBObject(`../../DATA/Model/Clothes/Cm_0_f0${f}.gb`), 
			new GBObject(`../../DATA/Model/Clothes/Cm_${g}_g01.gb`), 
			new GBObject(`../../DATA/Model/Clothes/Cm_${s}_s01.gb`), 
			new GBObject(`../../DATA/Model/Clothes/Cm_${h1}_h0${(h1 === 0) ? h2 : '1'}.gb`)
		];
		let bones = new GBObject('../../DATA/Model/Motion/tm_bone.gb');

		let mesh = await this.createGeometry(formation, bones);
	}

	async setAnimation () {
		super.setAnimation(new GBObject('../../DATA/Model/Motion/Tm_0_01.gb'));
	}
}
