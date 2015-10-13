import GBLoader from '../loaders/GBLoader.js';

const URLLookup = {};
const gbLoader = new GBLoader();

class GBObject {
	constructor (url) {
		this.url = url;
		this.loaded = false;
	}

	load () {
		return new Promise ((resolve, reject) => {
			if (this.loaded) {
				resolve(this.geometryData);
				return;
			}

			let promise = gbLoader.load(this.url);
			promise.then((geometryData) => {
				this.loaded = true;
				this.geometryData = geometryData;

				resolve(geometryData);
			});
			promise.catch(reject);
		});
	}
}

export default (url) => {
	if (URLLookup[url] !== undefined) {
		return URLLookup[url];
	}
	return URLLookup[url] = new GBObject(url);
};
