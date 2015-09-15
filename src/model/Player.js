import Model from './model.js';
import GBObject from './GBObject.js';
import 'mrdoob/three.js';

const path = '../../DATA/Model/';

export default class Player extends Model {
	constructor (type, formation) {
		super();

		this.type = type;
		switch (type) {
			case 'ARCHER': 
				this.identifyer = 'm';
				break;

			case 'MAGE': 
				this.identifyer = 'r';
				break;

			case 'KNIGHT': 
				this.identifyer = 'w';
				break;
		}

		this.formation = formation;
		this.setGeometry(this.formation);
		this.setAnimation();
	}

	setGeometry (formation = {}) {
		for (let i in formation) {
			this.formation[i] = formation[i];
		}

		let {a, p, f, g, s, h1, h2} = this.formation;

		formation = [
			new GBObject(`${path}Clothes/C${this.identifyer}_${a}_a01.gb`), 
			new GBObject(`${path}Clothes/C${this.identifyer}_${p}_p01.gb`), 
			new GBObject(`${path}Clothes/C${this.identifyer}_0_f0${f}.gb`), 
			new GBObject(`${path}Clothes/C${this.identifyer}_${g}_g01.gb`), 
			new GBObject(`${path}Clothes/C${this.identifyer}_${s}_s01.gb`), 
			new GBObject(`${path}Clothes/C${this.identifyer}_${h1}_h0${(h1 === 0) ? h2 : '1'}.gb`)
		];
		let bones = new GBObject(`${path}Motion/t${this.identifyer}_bone.gb`);

		super.setGeometry(formation, bones);
	}

	setAnimation () {
		super.setAnimation(new GBObject(`${path}Motion/T${this.identifyer}_0_01.gb`));
	}
}
