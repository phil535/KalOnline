import Model from './model.js';
import { padStr } from 'src/utils/Utils.js';
import GBObject from './GBObject.js';
import { KNIGHT, MAGE, ARCHER } from 'src/Constants.js';
import 'mrdoob/three.js';

const PATH_BASE = '/DATA/Model/';
const CONFIG_TYPES = {
  [ARCHER]: {
    identifier: 'M'
  },
  [MAGE]: {
    identifier: 'R'
  },
  [KNIGHT]: {
    identifier: 'W'
  }
};

export default class Player extends Model {
  constructor (type, formation) {
    super();

    this.type = type;
    this.identifier = CONFIG_TYPES[type].identifier;
    this.clothesBase = `${PATH_BASE}Clothes/C${this.identifier}`;
    this.motionBase = `${PATH_BASE}Motion/T${this.identifier}`;

    this.formation = { a: 0, p: 0, f: 1, g: 0, s: 0, h1: 0, h2: 1 };
    this.setGeometry(formation);
    this.setAnimation();
  }

  setGeometry (formationData) {
    Object.entries(formationData).forEach(([key, value]) => {
      if (this.formation[key] !== undefined) {
        this.formation[key] = value;
      }
    });

    let { a, p, f, g, s, h1, h2 } = this.formation;
    h2 = (h1 === 0) ? h2 : '1';

    const formation = [
      new GBObject(`${this.clothesBase}_${a}_a01.gb`),
      new GBObject(`${this.clothesBase}_${p}_p01.gb`),
      new GBObject(`${this.clothesBase}_0_f${padStr(f, 2)}.gb`),
      new GBObject(`${this.clothesBase}_${g}_g01.gb`),
      new GBObject(`${this.clothesBase}_${s}_s01.gb`),
      new GBObject(`${this.clothesBase}_${h1}_h${padStr(h2, 2)}.gb`)
    ];
    const bones = new GBObject(`${this.motionBase}_bone.gb`);

    super.setGeometry(formation, bones);
  }

  setAnimation () {
    super.setAnimation(new GBObject(`${this.motionBase}_0_01.gb`));
  }
}
