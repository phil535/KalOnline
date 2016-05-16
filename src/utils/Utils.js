export const MathExtended = {
	clamb(value, min, max) {
		return (value > min) ? ((value < max) ? value : max) : min;
	},
	randomInt(min, max) {
		return Math.floor(MathExtended.random(min, max + 1));
	},
	random(min = 0, max = 1) {
		return Math.random() * (max - min) + min;
	},
	sign(value) {
		return (value > 0) ? 1 : ((value < 0) ? -1 : 0);
	}
};

export const padStr = (str, length) => {
	str = String(str);
	while (str.length < length) {
		str = `0${str}`;
	}

	return str;
};
