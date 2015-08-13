import 'mrdoob/three.js';

// GTX is just a DDS with an encrypted header

var GTXtoDDS = [0xF6, 0xD2, 0x72, 0x29, 0xAF, 0xD1, 0x3D, 0xB2, 0x98, 0xC3, 0x9E, 0x23, 0xC6, 0xF9, 0x6F, 0x2B, 0x32, 0x57, 0x6B, 0x16, 0x0E, 0x2E, 0xE3, 0x25, 0xE8, 0x19, 0x47, 0x67, 0x7D, 0x8A, 0x65, 0x00, 0x18, 0xC8, 0xB9, 0x14, 0x6E, 0xCA, 0x20, 0x4C, 0xEC, 0x8F, 0x4A, 0xC5, 0xD7, 0x3A, 0xB8, 0xFC, 0xE9, 0xB7, 0x42, 0xFF, 0x78, 0x1E, 0x7F, 0x12, 0xB0, 0x36, 0xE6, 0x04, 0x4D, 0xF5, 0x01, 0x60, 0x40, 0x50, 0xDE, 0x09, 0x03, 0x95, 0x75, 0x0A, 0x2C, 0x54, 0xA7, 0xFA, 0x0C, 0xEA, 0x82, 0xD4, 0x7A, 0xE2, 0x11, 0x84, 0x4B, 0x46, 0x3B, 0xC7, 0xB3, 0x08, 0x7B, 0xBC, 0xF3, 0x71, 0x40, 0xF2, 0x10, 0x37, 0x3E, 0xAA, 0x64, 0x4F, 0x26, 0x7E, 0x66, 0xFB, 0x81, 0x8D, 0x58, 0x0B, 0xE4, 0xEB, 0x5E, 0x80, 0x5F, 0xA3, 0x02, 0x87, 0x8E, 0xD6, 0x89, 0xC9, 0x44, 0x2A, 0x55, 0x92, 0xCD, 0xBB, 0x06, 0x81, 0x5B, 0xF0, 0xF7, 0xD9, 0x49, 0x6C, 0xBE, 0x24, 0x0F, 0x45, 0xA8, 0xE7, 0xDA, 0x61, 0x8C, 0xB4, 0xD8, 0xBD, 0x05, 0x5C, 0x90, 0x4E, 0x33, 0x76, 0x1A, 0x53, 0x1D, 0x9D, 0xB1, 0x70, 0x1F, 0x88, 0xCE, 0x1C, 0x2D, 0x5D, 0x9A, 0x59, 0x38, 0x30, 0x51, 0xDD, 0xA5, 0xDB, 0x7C, 0x15, 0xFD, 0x99, 0xCB, 0xBA, 0x6D, 0x17, 0x31, 0x41, 0x73, 0x77, 0x34, 0x28, 0xC2, 0x62, 0x79, 0xFE, 0xB5, 0x86, 0xC2, 0xD5, 0xEE, 0xA9, 0xA0, 0xF8, 0x85, 0xA4, 0x74, 0xEF, 0x68, 0xB6, 0xA6, 0x97, 0xED, 0x52, 0x8B, 0xA2, 0x2F, 0x94, 0x48, 0x3F, 0xD0, 0x07, 0x13, 0x9C, 0xE5, 0x69, 0xA1, 0xC4, 0x56, 0x43, 0x3C, 0xAC, 0x0D, 0xCC, 0xBF, 0x83, 0xAB, 0x21, 0x22, 0x96, 0xDF, 0x6A, 0xF4, 0xE0, 0x63, 0xDC, 0x35, 0x39, 0x9F, 0xAE, 0xE1, 0x9B, 0xCF, 0x93, 0xAD, 0xF1, 0x91, 0x1B, 0xD3, 0xC0, 0xF6];
var GTX_MAGIC = 0x204C414B;
var DDS_MAGIC = 0x20534444;

var DDSD_CAPS = 0x1,
	DDSD_HEIGHT = 0x2,
	DDSD_WIDTH = 0x4,
	DDSD_PITCH = 0x8,
	DDSD_PIXELFORMAT = 0x1000,
	DDSD_MIPMAPCOUNT = 0x20000,
	DDSD_LINEARSIZE = 0x80000,
	DDSD_DEPTH = 0x800000;

var DDSCAPS_COMPLEX = 0x8,
	DDSCAPS_MIPMAP = 0x400000,
	DDSCAPS_TEXTURE = 0x1000;

var DDSCAPS2_CUBEMAP = 0x200,
	DDSCAPS2_CUBEMAP_POSITIVEX = 0x400,
	DDSCAPS2_CUBEMAP_NEGATIVEX = 0x800,
	DDSCAPS2_CUBEMAP_POSITIVEY = 0x1000,
	DDSCAPS2_CUBEMAP_NEGATIVEY = 0x2000,
	DDSCAPS2_CUBEMAP_POSITIVEZ = 0x4000,
	DDSCAPS2_CUBEMAP_NEGATIVEZ = 0x8000,
	DDSCAPS2_VOLUME = 0x200000;

var DDPF_ALPHAPIXELS = 0x1,
	DDPF_ALPHA = 0x2,
	DDPF_FOURCC = 0x4,
	DDPF_RGB = 0x40,
	DDPF_YUV = 0x200,
	DDPF_LUMINANCE = 0x20000;

function fourCCToInt32( value ) {

	return value.charCodeAt(0) +
		(value.charCodeAt(1) << 8) +
		(value.charCodeAt(2) << 16) +
		(value.charCodeAt(3) << 24);

}

function int32ToFourCC( value ) {

	return String.fromCharCode(
		value & 0xff,
		(value >> 8) & 0xff,
		(value >> 16) & 0xff,
		(value >> 24) & 0xff
	);
}

function loadARGBMip( buffer, dataOffset, width, height ) {
	var dataLength = width*height*4;
	var srcBuffer = new Uint8Array( buffer, dataOffset, dataLength );
	var byteArray = new Uint8Array( dataLength );
	var dst = 0;
	var src = 0;
	for ( var y = 0; y < height; y++ ) {
		for ( var x = 0; x < width; x++ ) {
			var b = srcBuffer[src]; src++;
			var g = srcBuffer[src]; src++;
			var r = srcBuffer[src]; src++;
			var a = srcBuffer[src]; src++;
			byteArray[dst] = r; dst++;	//r
			byteArray[dst] = g; dst++;	//g
			byteArray[dst] = b; dst++;	//b
			byteArray[dst] = a; dst++;	//a
		}
	}
	return byteArray;
}

var FOURCC_DXT1 = fourCCToInt32("DXT1");
var FOURCC_DXT3 = fourCCToInt32("DXT3");
var FOURCC_DXT5 = fourCCToInt32("DXT5");

var headerLengthInt = 31; // The header length in 32 bit ints

// Offsets into the header array

var off_magic = 0;

var off_size = 1;
var off_flags = 2;
var off_height = 3;
var off_width = 4;

var off_mipmapCount = 7;

var off_pfFlags = 20;
var off_pfFourCC = 21;
var off_RGBBitCount = 22;
var off_RBitMask = 23;
var off_GBitMask = 24;
var off_BBitMask = 25;
var off_ABitMask = 26;

var off_caps = 27;
var off_caps2 = 28;
var off_caps3 = 29;
var off_caps4 = 30;

export default class GTXLoader extends THREE.CompressedTextureLoader {
	
	constructor () {
		super();
		this._parser = this.parse;
	}

	parse (buffer, loadMipmaps) {

		var dds = { mipmaps: [], width: 0, height: 0, format: null, mipmapCount: 1 };

		// Adapted from @toji's DDS utils
		//	https://github.com/toji/webgl-texture-utils/blob/master/texture-util/dds.js

		// All values and structures referenced from:
		// http://msdn.microsoft.com/en-us/library/bb943991.aspx/

		// Parse header
		
		var header = new Int32Array( buffer, 0, headerLengthInt );

		var decrypt = new Uint8Array(buffer, 8, 64);
		for (var i = 0; i < decrypt.length; i += 4) {
			header[i/4 + 2] = 
				(GTXtoDDS[decrypt[i + 3]] << 24) | 
				(GTXtoDDS[decrypt[i + 2]] << 16) | 
				(GTXtoDDS[decrypt[i + 1]] << 8) | 
				GTXtoDDS[decrypt[i]];
		}

		if ( header[ off_magic ] !== GTX_MAGIC ) {

			console.error( 'THREE.GTXLoader.parse: Invalid magic number in GTX header.' );
			return dds;

		}

		if ( ! header[ off_pfFlags ] & DDPF_FOURCC ) {

			console.error( 'THREE.GTXLoader.parse: Unsupported format, must contain a FourCC code.' );
			return dds;

		}

		var blockBytes;

		var fourCC = header[ off_pfFourCC ];

		var isRGBAUncompressed = false;

		switch ( fourCC ) {

			case FOURCC_DXT1:

				blockBytes = 8;
				dds.format = THREE.RGB_S3TC_DXT1_Format;
				break;

			case FOURCC_DXT3:

				blockBytes = 16;
				dds.format = THREE.RGBA_S3TC_DXT3_Format;
				break;

			case FOURCC_DXT5:

				blockBytes = 16;
				dds.format = THREE.RGBA_S3TC_DXT5_Format;
				break;

			default:

				if( header[off_RGBBitCount] ==32 
					&& header[off_RBitMask]&0xff0000
					&& header[off_GBitMask]&0xff00 
					&& header[off_BBitMask]&0xff
					&& header[off_ABitMask]&0xff000000  ) {
					isRGBAUncompressed = true;
					blockBytes = 64;
					dds.format = THREE.RGBAFormat;
				} else {
					console.error( 'THREE.GTXLoader.parse: Unsupported FourCC code ', int32ToFourCC( fourCC ) );
					return dds;
				}
		}

		dds.mipmapCount = 1;

		if ( header[ off_flags ] & DDSD_MIPMAPCOUNT && loadMipmaps !== false ) {

			dds.mipmapCount = Math.max( 1, header[ off_mipmapCount ] );

		}

		//TODO: Verify that all faces of the cubemap are present with DDSCAPS2_CUBEMAP_POSITIVEX, etc.

		dds.isCubemap = header[ off_caps2 ] & DDSCAPS2_CUBEMAP ? true : false;

		dds.width = header[ off_width ];
		dds.height = header[ off_height ];

		var dataOffset = header[ off_size ] + 4;

		// Extract mipmaps buffers

		var width = dds.width;
		var height = dds.height;

		var faces = dds.isCubemap ? 6 : 1;

		for ( var face = 0; face < faces; face ++ ) {

			for ( var i = 0; i < dds.mipmapCount; i ++ ) {

				if( isRGBAUncompressed ) {
					var byteArray = loadARGBMip( buffer, dataOffset, width, height );
					var dataLength = byteArray.length;
				} else {
					var dataLength = Math.max( 4, width ) / 4 * Math.max( 4, height ) / 4 * blockBytes;
					var byteArray = new Uint8Array( buffer, dataOffset, dataLength );
				}
				
				var mipmap = { "data": byteArray, "width": width, "height": height };
				dds.mipmaps.push( mipmap );

				dataOffset += dataLength;

				width = Math.max( width * 0.5, 1 );
				height = Math.max( height * 0.5, 1 );

			}

			width = dds.width;
			height = dds.height;

		}

		return dds;
	}
};
