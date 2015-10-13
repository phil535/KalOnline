export default class Color {
	constructor (...args) {
		if (args.length !== 0) {
			this.setColor(...args);
		}
		else {
			this.r = this.g = this.b = 0;
			this.a = 1;
		}
	}

	setColor (...args) {
		var [r, g, b] = args;
		var [hex] = args;

		if (typeof r === 'number' && typeof g === 'number' && typeof b === 'number') {
			this.setFromRGBA(...args);
		}
		else if (typeof hex === 'number') {
			this.setFromHEX(...args);
		}
	}

	setFromRGB (r, g, b) {
		this.setFromRGBA(r, g, b, 1);
	}

	setFromRGBA (r, g, b, a = 1) {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}

	setFromHEX (hex, a = 1) {
		hex = Math.floor(hex);

		this.r = hex >> 16 & 255;
		this.g = hex >> 8 & 255;
		this.b = hex & 255;
		this.a = a;
	}

	blend (color) {
		let alpha = color.a;
		let alpha1 = 1 - alpha;

		let r = alpha * color.r + alpha1 * this.r;
		let g = alpha * color.g + alpha1 * this.g;
		let b = alpha * color.b + alpha1 * this.b;
		let a = (this.alpha < 1) ? (1 - ((1 - this.a) * color.a)) : 1;

		return new Color(r, g, b, a);
	}
};
