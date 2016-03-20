import { Canvas, Image, transfer } from 'casperlamboo/canvas-webworker';

const TEXTURE_WIDTH = 8192;
const TEXTURE_HEIGHT = 8192;

self.addEventListener('message', ({ data }) => {
  switch (data.msg) {
    case 'KCM_DATA':
      const KCMData = data.transfer.map((layerData) => ({
        alphaMap: layerData.alphaMap,
        textureImage: transfer.decode(layerData.texture)
      }));

      createTextrue(KCMData);
      break;
  }
});

function createTextrue(KCMData) {
  const start = new Date().getTime();

  const canvas = new Canvas(TEXTURE_WIDTH, TEXTURE_HEIGHT);
  const context = canvas.getContext('2d');

  let first = true;
  for (const { textureImage, alphaMap } of KCMData) {
    const texturePattern = context.createPattern(textureImage, 'repeat');

    if (first) {
			context.fillStyle = texturePattern;
			context.fillRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);

			first = false;
		} else {
      const alphaImage = createAlphaMap(alphaMap, 256, 256);

			const image = combineAlphaPattern(alphaImage, texturePattern, TEXTURE_WIDTH, TEXTURE_HEIGHT);
			context.drawImage(image, 0, 0);
		}

    console.log('finish texture');
  }

  const { data, buffer } = transfer.encode(canvas);

  const end = new Date().getTime();

  console.log(end - start);
  self.postMessage({ msg: 'TEXTURE', transfer: data }, [buffer]);
}

function createAlphaMap (map, width, height) {
	const canvas = new Canvas(width, height);
	const context = canvas.getContext('2d');

	const imageData = context.createImageData(width, height);

	for (let x = 0; x < width; x ++) {
		for (let y = 0; y < height; y ++) {
			const index = y * width + x;
			const color = map[index];

			imageData.data[index * 4 + 3] = color;
		}
	}

	context.putImageData(imageData, 0, 0);

	return canvas;
}

function combineAlphaPattern(alpha, pattern, width, height) {
  const canvas = new Canvas(width, height);
	const context = canvas.getContext('2d');

	context.drawImage(alpha, 0, 0, width, height);

	context.globalCompositeOperation = 'source-in';

	context.fillStyle = pattern;
	context.fillRect(0, 0, width, height);

	return canvas;
}
