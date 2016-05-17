import GBLoader from '../loaders/GBLoader.js';

const URL_LOOKUP = {};
const GB_LOADER = new GBLoader();

class GBObject {
  constructor(url) {
    this.url = url;
    this.loaded = false;
  }

  async load() {
    if (!this.loaded) {
      const geometryData = await new Promise((resolve, reject) => {
        GB_LOADER.load(this.url, resolve, undefined, reject);
      });
      this.loaded = true;
      this.geometryData = geometryData;
    }

    return this.geometryData;
  }
}

export default (url) => {
  if (URL_LOOKUP[url] !== undefined) {
    return URL_LOOKUP[url];
  }
  return URL_LOOKUP[url] = new GBObject(url);
};
