import OPLLoader from '/src/loaders/OPLLoader.js';

const loaderOPL = new OPLLoader();
loaderOPL.load('/data/MAPS/n_031_031.opl', (opl) => {
  document.getElementById('output').innerHTML = JSON.stringify(opl, null, 2);
});
