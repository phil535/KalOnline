import GBLoader from './loaders/GBLoader.js';

let loader = new GBLoader();

export default class GBObject {
	constructor (url) {
		this.url = url;
		this.loaded = false;
	}

	load () {
		return new Promise ((resolve, reject) => {
			if (this.loaded) {
				resolve(this);
				return;
			}

			loader.load(this.url).then((geometryData) => {
				this.loaded = true;

				for (let i in geometryData) {
					this[i] = geometryData[i];
				}

				resolve(this);
			});
		});
	}
}