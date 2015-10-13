import 'mrdoob/three.js';
import Color from './Color.js';
import {MathExtended} from './Utils.js';

export default class ImageData {
	constructor (...args) {
		let [width, height, data = []] = args;
		let [imageData] = args;
		let [context] = args;

		if (typeof width === 'number' && typeof height === 'number') {
			this.width = width;
			this.height = height;
			this.data = data;
		}
		else if (context instanceof CanvasRenderingContext2D) {
			this.width = context.canvas.width;
			this.height = context.canvas.height;
			
			let imageData = context.getImageData(0, 0, this.width, this.height);
			this.data = imageData.data;
		}
		else {
			this.width = imageData.width;
			this.height = imageData.height;
			this.data = imageData.data;	
		}
	}

	getPixel (x, y) {
		let i = (y * this.width + x) * 4;

		let r = this.data[i];
		let g = this.data[i + 1];
		let b = this.data[i + 2];
		let a = this.data[i + 3] / 255;

		return new Color(r, g, b, a);
	}

	setPixel (color, x, y) {
		let i = (y * this.width + x) * 4;

		this.data[i] = MathExtended.clamb(Math.round(color.r), 0, 255);
		this.data[i + 1] = MathExtended.clamb(Math.round(color.g), 0, 255);
		this.data[i + 2] = MathExtended.clamb(Math.round(color.b), 0, 255);
		this.data[i + 3] = MathExtended.clamb(Math.round(color.a * 255), 0, 255);
	}
}
