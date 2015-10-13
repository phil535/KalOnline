import Model from './model.js';
import {padStr} from '../utils/Utils.js';
import GBObject from './GBObject.js';
import 'mrdoob/three.js';

const pathBase = '../../DATA/Model/';
const typeConfigs = {
	'ARCHER': {
		identifyer: 'm'
	}, 
	'MAGE': {
		identifyer: 'r'
	}, 
	'KNIGHT': {
		identifyer: 'w'
	}
};

export default class Player extends Model {
	constructor (type, formation) {
		super();

		this.type = type;
		this.identifyer = typeConfigs[type].identifyer;

		this.formation = formation;
		this.setGeometry(this.formation);
		this.setAnimation();
	}

	setGeometry (formationData) {
		for (let i in formationData) {
			this.formation[i] = formationData[i];
		}

		let {a, p, f, g, s, h1, h2} = this.formation;
		h2 = (h1 === 0) ? h2 : '1';

		let formation = [
			new GBObject(`${pathBase}Clothes/C${this.identifyer}_${a}_a01.gb`), 
			new GBObject(`${pathBase}Clothes/C${this.identifyer}_${p}_p01.gb`), 
			new GBObject(`${pathBase}Clothes/C${this.identifyer}_0_f${padStr(f, 2)}.gb`), 
			new GBObject(`${pathBase}Clothes/C${this.identifyer}_${g}_g01.gb`), 
			new GBObject(`${pathBase}Clothes/C${this.identifyer}_${s}_s01.gb`), 
			new GBObject(`${pathBase}Clothes/C${this.identifyer}_${h1}_h${padStr(h2, 2)}.gb`)
		];
		let bones = new GBObject(`${pathBase}Motion/t${this.identifyer}_bone.gb`);

		super.setGeometry(formation, bones);
	}

	setAnimation () {
		super.setAnimation(new GBObject(`${pathBase}Motion/T${this.identifyer}_0_01.gb`));
	}
}
