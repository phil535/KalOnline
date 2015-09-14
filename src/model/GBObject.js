import GBLoader from '../loaders/GBLoader.js';

let URLLookup = {};
let loader = new GBLoader();

class GBObject {
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

			let promise = loader.load(this.url);
			promise.then((geometryData) => {
				this.loaded = true;

				for (let i in geometryData) {
					this[i] = geometryData[i];
				}

				resolve(this);
			});
			promise.catch(reject);
		});
	}
}

export default function factory (url) {
	if (URLLookup[url] !== undefined) {
		return URLLookup[url];
	}
	return URLLookup[url] = new GBObject(url);
};
