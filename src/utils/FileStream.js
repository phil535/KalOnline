// DataView Shim from THREE.js STL Loader
// https://github.com/three/blob/5c7e0df9b100ba40cdcaaf530196290e16c34858/examples/js/loaders/STLLoader.js
if (typeof DataView === 'undefined') {
  class DataView {
    constructor(buffer = {}, byteOffset = 0, byteLength = buffer.byteLength = buffer.length) {
      this._isString = typeof buffer === "string";
    }
    _getCharCodes(buffer, start = 0, length = buffer.length) {
      const end = start + length;
      const codes = [];

      for (let i = start; i < end; i ++) {
        codes.push(buffer.charCodeAt(i) & 0xff);
      }

      return codes;
    }
    _getBytes(length, byteOffset, littleEndian) {
      let result;

      // Handle the lack of endianness
      if (littleEndian === undefined) {
        littleEndian = this._littleEndian;
      }

      // Handle the lack of byteOffset
      if (byteOffset === undefined) {
        byteOffset = this.byteOffset;
      } else {
        byteOffset = this.byteOffset + byteOffset;
      }

      if (length === undefined) {
        length = this.byteLength - byteOffset;
      }

      // Error Checking
      if (typeof byteOffset !== 'number') {
        throw new TypeError('DataView byteOffset is not a number');
      }

      if (length < 0 || byteOffset + length > this.byteLength) {
        throw new Error('DataView length or (byteOffset+length) value is out of bounds');
      }

      if (this.isString){
        result = this._getCharCodes(this.buffer, byteOffset, byteOffset + length);
      } else {
        result = this.buffer.slice(byteOffset, byteOffset + length);
      }

      if (!littleEndian && length > 1) {
        if (!(result instanceof Array)) {
          result = Array.prototype.slice.call(result);
        }
        result.reverse();
      }

      return result;
    }
    getFloat64(byteOffset, littleEndian) {
      const b = this._getBytes(8, byteOffset, littleEndian);

      const sign = 1 - (2 * (b[7] >> 7));
      const exponent = ((((b[7] << 1) & 0xff) << 3) | (b[6] >> 4)) - ((1 << 10) - 1);

      // Binary operators such as | and << operate on 32 bit values, using + and Math.pow(2) instead
      const mantissa = ((b[6] & 0x0f) * Math.pow(2, 48)) + (b[5] * Math.pow(2, 40)) + (b[4] * Math.pow(2, 32)) +
              (b[3] * Math.pow(2, 24)) + (b[2] * Math.pow(2, 16)) + (b[1] * Math.pow(2, 8)) + b[0];

      if (exponent === 1024) {
        if (mantissa !== 0) {
          return NaN;
        } else {
          return sign * Infinity;
        }
      }

      if (exponent === -1023) { // Denormalized
        return sign * mantissa * Math.pow(2, -1022 - 52);
      }

      return sign * (1 + mantissa * Math.pow(2, -52)) * Math.pow(2, exponent);
    }
    getFloat32(byteOffset, littleEndian) {
      const b = this._getBytes(4, byteOffset, littleEndian);
      const sign = 1 - (2 * (b[3] >> 7));
      const exponent = (((b[3] << 1) & 0xff) | (b[2] >> 7)) - 127;
      const mantissa = ((b[2] & 0x7f) << 16) | (b[1] << 8) | b[0];

      if (exponent === 128) {
        if (mantissa !== 0) {
          return NaN;
        } else {
          return sign * Infinity;
        }
      }

      if (exponent === -127) { // Denormalized
        return sign * mantissa * Math.pow(2, -126 - 23);
      }

      return sign * (1 + mantissa * Math.pow(2, -23)) * Math.pow(2, exponent);
    }
    getInt32(byteOffset, littleEndian) {
      const b = this._getBytes(4, byteOffset, littleEndian);
      return (b[3] << 24) | (b[2] << 16) | (b[1] << 8) | b[0];
    }
    getUint32(byteOffset, littleEndian) {
      return this.getInt32(byteOffset, littleEndian) >>> 0;
    }
    getInt16(byteOffset, littleEndian) {
      return (this.getUint16(byteOffset, littleEndian) << 16) >> 16;
    }
    getUint16(byteOffset, littleEndian) {
      const b = this._getBytes(2, byteOffset, littleEndian);
      return (b[1] << 8) | b[0];
    }
    getInt8(byteOffset) {
      return (this.getUint8(byteOffset) << 24) >> 24;
    }
    getUint8(byteOffset) {
      return this._getBytes(1, byteOffset)[0];
    }
  }
}

const BYTE_SIZE = { 'S': 1, 'B': 1, 'H': 2, 'I': 4, 'F': 4, 'D': 8 };

export default class FileStream {
  constructor(arrayBuffer, littleEndian = true) {
    this.dataView = new DataView(arrayBuffer);
    this.littleEndian = littleEndian;
    this.size = this.dataView.byteLength;
    this.position = 0;
  }
  read(identifyer) {
    let value;
    switch (identifyer) {
      case 's':
        value = String.fromCharCode(this.dataView.getInt8(this.position, this.littleEndian));
        break;

      case 'b':
        value = this.dataView.getInt8(this.position, this.littleEndian);
        break;

      case 'B':
        value = this.dataView.getUint8(this.position, this.littleEndian);
        break;

      case 'h':
        value = this.dataView.getInt16(this.position, this.littleEndian);
        break;

      case 'H':
        value = this.dataView.getUint16(this.position, this.littleEndian);
        break;

      case "i":
        value = this.dataView.getInt32(this.position, this.littleEndian);
        break;

      case "I":
        value = this.dataView.getUint32(this.position, this.littleEndian);
        break;

      case 'f':
        value = this.dataView.getFloat32(this.position, this.littleEndian);
        break;

      case 'd':
        value = this.dataView.getFloat64(this.position, this.littleEndian);
        break;

      default:
        return null;
    }

    this.position += BYTE_SIZE[identifyer.toUpperCase()];
    return value;
  }
  readString(length, littleEndian = true) {
    let string = '';
    for (let i = 0; i < length; i ++) {
      string += this.read('s');
    }

    return string;
  }
}
