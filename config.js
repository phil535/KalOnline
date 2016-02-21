System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime"
    ],
    "stage": 0
  },
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  meta: {
    "three.js/controls/EditorControls.js": {
      "deps": [
        "three.js"
      ]
    },
    "three.js/loaders/DDSLoader.js": {
      "deps": [
        "three.js"
      ]
    }
  },

  map: {
    "babel": "npm:babel-core@5.8.5",
    "babel-runtime": "npm:babel-runtime@5.8.5",
    "casperlamboo/filestream": "github:casperlamboo/filestream@master",
    "core-js": "npm:core-js@0.9.18",
    "mrdoob/three.js": "github:mrdoob/three.js@r72",
    "mrdoob/three.js/controls/EditorControls.js": "github:mrdoob/three.js@r72/examples/js/controls/EditorControls.js",
    "mrdoob/three.js/loaders/DDSLoader.js": "github:mrdoob/three.js@r72/examples/js/loaders/DDSLoader.js",
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "npm:babel-runtime@5.8.5": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:core-js@0.9.18": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    }
  }
});
