SystemJS.config({
  paths: {
    "github:": "jspm_packages/github/",
    "npm:": "jspm_packages/npm/",
    "kalonline/": "src/"
  },
  browserConfig: {
    "baseURL": "/",
    "trace": true
  },
  devConfig: {
    "map": {
      "babel-runtime": "npm:babel-runtime@5.8.38",
      "core-js": "npm:core-js@1.2.7",
      "plugin-babel": "npm:systemjs-plugin-babel@0.0.12",
      "systemjs-hot-reloader": "github:capaj/systemjs-hot-reloader@0.6.0"
    },
    "packages": {
      "npm:babel-runtime@5.8.38": {
        "map": {}
      },
      "github:capaj/systemjs-hot-reloader@0.6.0": {
        "map": {
          "debug": "npm:debug@2.2.0",
          "weakee": "npm:weakee@1.0.0",
          "socket.io-client": "github:socketio/socket.io-client@1.4.8"
        }
      },
      "npm:debug@2.2.0": {
        "map": {
          "ms": "npm:ms@0.7.1"
        }
      }
    }
  },
  transpiler: "plugin-babel",
  packages: {
    "kalonline": {
      "main": "src/js/index.js",
      "format": "esm",
      "meta": {
        "*.js": {
          "loader": "plugin-babel",
          "babelOptions": {
            "stage1": true,
            "plugins": [
              "babel-plugin-transform-react-jsx"
            ]
          }
        },
        "*.css": {
          "loader": "css"
        }
      },
      "map": {
        "./js/services/talkus.js": {
          "~production": "@empty"
        }
      }
    }
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
    "babel": "npm:babel-core@5.8.38",
    "mrdoob/three.js/controls/EditorControls.js": "github:mrdoob/three.js@r72/examples/js/controls/EditorControls.js",
    "mrdoob/three.js/loaders/DDSLoader.js": "github:mrdoob/three.js@r72/examples/js/loaders/DDSLoader.js"
  }
});

SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json",
    "github:*/*.json"
  ],
  map: {
    "css": "github:MeoMix/jspm-loader-css@master",
    "cluster": "github:jspm/nodelibs-cluster@0.2.0-alpha",
    "babel-plugin-transform-react-jsx": "npm:babel-plugin-transform-react-jsx@6.8.0",
    "domain": "github:jspm/nodelibs-domain@0.2.0-alpha",
    "assert": "github:jspm/nodelibs-assert@0.2.0-alpha",
    "buffer": "github:jspm/nodelibs-buffer@0.2.0-alpha",
    "child_process": "github:jspm/nodelibs-child_process@0.2.0-alpha",
    "constants": "github:jspm/nodelibs-constants@0.2.0-alpha",
    "crypto": "github:jspm/nodelibs-crypto@0.2.0-alpha",
    "dgram": "github:jspm/nodelibs-dgram@0.2.0-alpha",
    "dns": "github:jspm/nodelibs-dns@0.2.0-alpha",
    "ecc-jsbn": "npm:ecc-jsbn@0.1.1",
    "events": "github:jspm/nodelibs-events@0.2.0-alpha",
    "fs": "github:jspm/nodelibs-fs@0.2.0-alpha",
    "http": "github:jspm/nodelibs-http@0.2.0-alpha",
    "https": "github:jspm/nodelibs-https@0.2.0-alpha",
    "jodid25519": "npm:jodid25519@1.0.2",
    "jsbn": "npm:jsbn@0.1.0",
    "mrdoob/three.js": "github:mrdoob/three.js@r72",
    "net": "github:jspm/nodelibs-net@0.2.0-alpha",
    "os": "github:jspm/nodelibs-os@0.2.0-alpha",
    "path": "github:jspm/nodelibs-path@0.2.0-alpha",
    "process": "github:jspm/nodelibs-process@0.2.0-alpha",
    "punycode": "github:jspm/nodelibs-punycode@0.2.0-alpha",
    "querystring": "github:jspm/nodelibs-querystring@0.2.0-alpha",
    "react": "npm:react@15.3.1",
    "react-dom": "npm:react-dom@15.3.1",
    "stream": "github:jspm/nodelibs-stream@0.2.0-alpha",
    "string_decoder": "github:jspm/nodelibs-string_decoder@0.2.0-alpha",
    "timers": "github:jspm/nodelibs-timers@0.2.0-alpha",
    "tls": "github:jspm/nodelibs-tls@0.2.0-alpha",
    "tty": "github:jspm/nodelibs-tty@0.2.0-alpha",
    "tweetnacl": "npm:tweetnacl@0.13.3",
    "url": "github:jspm/nodelibs-url@0.2.0-alpha",
    "util": "github:jspm/nodelibs-util@0.2.0-alpha",
    "vm": "github:jspm/nodelibs-vm@0.2.0-alpha",
    "zlib": "github:jspm/nodelibs-zlib@0.2.0-alpha"
  },
  packages: {
    "npm:browserify-aes@1.0.6": {
      "map": {
        "buffer-xor": "npm:buffer-xor@1.0.3",
        "cipher-base": "npm:cipher-base@1.0.2",
        "create-hash": "npm:create-hash@1.1.2",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
        "inherits": "npm:inherits@2.0.2",
        "systemjs-json": "github:systemjs/plugin-json@0.1.2"
      }
    },
    "npm:browserify-cipher@1.0.0": {
      "map": {
        "browserify-aes": "npm:browserify-aes@1.0.6",
        "browserify-des": "npm:browserify-des@1.0.0",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.0"
      }
    },
    "npm:browserify-des@1.0.0": {
      "map": {
        "cipher-base": "npm:cipher-base@1.0.2",
        "des.js": "npm:des.js@1.0.0",
        "inherits": "npm:inherits@2.0.2"
      }
    },
    "npm:browserify-rsa@4.0.1": {
      "map": {
        "bn.js": "npm:bn.js@4.11.6",
        "randombytes": "npm:randombytes@2.0.3"
      }
    },
    "npm:browserify-sign@4.0.0": {
      "map": {
        "bn.js": "npm:bn.js@4.11.6",
        "browserify-rsa": "npm:browserify-rsa@4.0.1",
        "create-hash": "npm:create-hash@1.1.2",
        "create-hmac": "npm:create-hmac@1.1.4",
        "elliptic": "npm:elliptic@6.3.1",
        "inherits": "npm:inherits@2.0.2",
        "parse-asn1": "npm:parse-asn1@5.0.0"
      }
    },
    "npm:browserify-zlib@0.1.4": {
      "map": {
        "pako": "npm:pako@0.2.9",
        "readable-stream": "npm:readable-stream@2.1.5"
      }
    },
    "npm:buffer-xor@1.0.3": {
      "map": {
        "systemjs-json": "github:systemjs/plugin-json@0.1.2"
      }
    },
    "npm:cipher-base@1.0.2": {
      "map": {
        "inherits": "npm:inherits@2.0.2"
      }
    },
    "npm:core-util-is@1.0.2": {
      "map": {}
    },
    "npm:create-ecdh@4.0.0": {
      "map": {
        "bn.js": "npm:bn.js@4.11.6",
        "elliptic": "npm:elliptic@6.3.1"
      }
    },
    "npm:create-hash@1.1.2": {
      "map": {
        "cipher-base": "npm:cipher-base@1.0.2",
        "inherits": "npm:inherits@2.0.2",
        "ripemd160": "npm:ripemd160@1.0.1",
        "sha.js": "npm:sha.js@2.4.5"
      }
    },
    "npm:create-hmac@1.1.4": {
      "map": {
        "create-hash": "npm:create-hash@1.1.2",
        "inherits": "npm:inherits@2.0.2"
      }
    },
    "npm:crypto-browserify@3.11.0": {
      "map": {
        "browserify-cipher": "npm:browserify-cipher@1.0.0",
        "browserify-sign": "npm:browserify-sign@4.0.0",
        "create-ecdh": "npm:create-ecdh@4.0.0",
        "create-hash": "npm:create-hash@1.1.2",
        "create-hmac": "npm:create-hmac@1.1.4",
        "diffie-hellman": "npm:diffie-hellman@5.0.2",
        "inherits": "npm:inherits@2.0.2",
        "pbkdf2": "npm:pbkdf2@3.0.4",
        "public-encrypt": "npm:public-encrypt@4.0.0",
        "randombytes": "npm:randombytes@2.0.3"
      }
    },
    "npm:des.js@1.0.0": {
      "map": {
        "inherits": "npm:inherits@2.0.2",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
      }
    },
    "npm:diffie-hellman@5.0.2": {
      "map": {
        "bn.js": "npm:bn.js@4.11.6",
        "miller-rabin": "npm:miller-rabin@4.0.0",
        "randombytes": "npm:randombytes@2.0.3",
        "systemjs-json": "github:systemjs/plugin-json@0.1.2"
      }
    },
    "npm:ecc-jsbn@0.1.1": {
      "map": {
        "jsbn": "npm:jsbn@0.1.0"
      }
    },
    "npm:evp_bytestokey@1.0.0": {
      "map": {
        "create-hash": "npm:create-hash@1.1.2"
      }
    },
    "npm:hash.js@1.0.3": {
      "map": {
        "inherits": "npm:inherits@2.0.2"
      }
    },
    "npm:jodid25519@1.0.2": {
      "map": {
        "jsbn": "npm:jsbn@0.1.0"
      }
    },
    "npm:miller-rabin@4.0.0": {
      "map": {
        "bn.js": "npm:bn.js@4.11.6",
        "brorand": "npm:brorand@1.0.5"
      }
    },
    "npm:parse-asn1@5.0.0": {
      "map": {
        "asn1.js": "npm:asn1.js@4.8.0",
        "browserify-aes": "npm:browserify-aes@1.0.6",
        "create-hash": "npm:create-hash@1.1.2",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
        "pbkdf2": "npm:pbkdf2@3.0.4",
        "systemjs-json": "github:systemjs/plugin-json@0.1.2"
      }
    },
    "npm:pbkdf2@3.0.4": {
      "map": {
        "create-hmac": "npm:create-hmac@1.1.4",
        "systemjs-json": "github:systemjs/plugin-json@0.1.2"
      }
    },
    "npm:process-nextick-args@1.0.7": {
      "map": {}
    },
    "npm:public-encrypt@4.0.0": {
      "map": {
        "bn.js": "npm:bn.js@4.11.6",
        "browserify-rsa": "npm:browserify-rsa@4.0.1",
        "create-hash": "npm:create-hash@1.1.2",
        "parse-asn1": "npm:parse-asn1@5.0.0",
        "randombytes": "npm:randombytes@2.0.3"
      }
    },
    "npm:punycode@1.3.2": {
      "map": {}
    },
    "npm:randombytes@2.0.3": {
      "map": {}
    },
    "npm:ripemd160@1.0.1": {
      "map": {}
    },
    "npm:sha.js@2.4.5": {
      "map": {
        "inherits": "npm:inherits@2.0.2"
      }
    },
    "npm:string_decoder@0.10.31": {
      "map": {}
    },
    "npm:util-deprecate@1.0.2": {
      "map": {}
    },
    "github:jspm/nodelibs-stream@0.2.0-alpha": {
      "map": {
        "stream-browserify": "npm:stream-browserify@2.0.1"
      }
    },
    "npm:stream-browserify@2.0.1": {
      "map": {
        "inherits": "npm:inherits@2.0.2",
        "readable-stream": "npm:readable-stream@2.1.5"
      }
    },
    "github:jspm/nodelibs-buffer@0.2.0-alpha": {
      "map": {
        "buffer-browserify": "npm:buffer@4.9.1"
      }
    },
    "github:jspm/nodelibs-crypto@0.2.0-alpha": {
      "map": {
        "crypto-browserify": "npm:crypto-browserify@3.11.0"
      }
    },
    "github:jspm/nodelibs-url@0.2.0-alpha": {
      "map": {
        "url-browserify": "npm:url@0.11.0"
      }
    },
    "github:jspm/nodelibs-http@0.2.0-alpha": {
      "map": {
        "http-browserify": "npm:stream-http@2.3.1"
      }
    },
    "npm:url@0.11.0": {
      "map": {
        "punycode": "npm:punycode@1.3.2",
        "querystring": "npm:querystring@0.2.0"
      }
    },
    "github:jspm/nodelibs-zlib@0.2.0-alpha": {
      "map": {
        "zlib-browserify": "npm:browserify-zlib@0.1.4"
      }
    },
    "github:jspm/nodelibs-string_decoder@0.2.0-alpha": {
      "map": {
        "string_decoder-browserify": "npm:string_decoder@0.10.31"
      }
    },
    "github:jspm/nodelibs-punycode@0.2.0-alpha": {
      "map": {
        "punycode-browserify": "npm:punycode@1.4.1"
      }
    },
    "github:jspm/nodelibs-os@0.2.0-alpha": {
      "map": {
        "os-browserify": "npm:os-browserify@0.2.1"
      }
    },
    "npm:buffer@4.9.1": {
      "map": {
        "isarray": "npm:isarray@1.0.0",
        "base64-js": "npm:base64-js@1.1.2",
        "ieee754": "npm:ieee754@1.1.6"
      }
    },
    "npm:readable-stream@2.1.5": {
      "map": {
        "isarray": "npm:isarray@1.0.0",
        "string_decoder": "npm:string_decoder@0.10.31",
        "inherits": "npm:inherits@2.0.2",
        "util-deprecate": "npm:util-deprecate@1.0.2",
        "process-nextick-args": "npm:process-nextick-args@1.0.7",
        "core-util-is": "npm:core-util-is@1.0.2",
        "buffer-shims": "npm:buffer-shims@1.0.0"
      }
    },
    "npm:stream-http@2.3.1": {
      "map": {
        "readable-stream": "npm:readable-stream@2.1.5",
        "inherits": "npm:inherits@2.0.2",
        "xtend": "npm:xtend@4.0.1",
        "builtin-status-codes": "npm:builtin-status-codes@2.0.0",
        "to-arraybuffer": "npm:to-arraybuffer@1.0.1"
      }
    },
    "npm:elliptic@6.3.1": {
      "map": {
        "bn.js": "npm:bn.js@4.11.6",
        "inherits": "npm:inherits@2.0.2",
        "hash.js": "npm:hash.js@1.0.3",
        "brorand": "npm:brorand@1.0.5"
      }
    },
    "npm:asn1.js@4.8.0": {
      "map": {
        "inherits": "npm:inherits@2.0.2",
        "bn.js": "npm:bn.js@4.11.6",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
      }
    },
    "npm:react@15.3.1": {
      "map": {
        "object-assign": "npm:object-assign@4.1.0",
        "fbjs": "npm:fbjs@0.8.4",
        "loose-envify": "npm:loose-envify@1.2.0"
      }
    },
    "npm:fbjs@0.8.4": {
      "map": {
        "loose-envify": "npm:loose-envify@1.2.0",
        "object-assign": "npm:object-assign@4.1.0",
        "promise": "npm:promise@7.1.1",
        "ua-parser-js": "npm:ua-parser-js@0.7.10",
        "immutable": "npm:immutable@3.8.1",
        "isomorphic-fetch": "npm:isomorphic-fetch@2.2.1",
        "core-js": "npm:core-js@1.2.7"
      }
    },
    "npm:loose-envify@1.2.0": {
      "map": {
        "js-tokens": "npm:js-tokens@1.0.3"
      }
    },
    "npm:isomorphic-fetch@2.2.1": {
      "map": {
        "node-fetch": "npm:node-fetch@1.6.0",
        "whatwg-fetch": "npm:whatwg-fetch@1.0.0"
      }
    },
    "npm:promise@7.1.1": {
      "map": {
        "asap": "npm:asap@2.0.4"
      }
    },
    "npm:node-fetch@1.6.0": {
      "map": {
        "encoding": "npm:encoding@0.1.12",
        "is-stream": "npm:is-stream@1.1.0"
      }
    },
    "npm:encoding@0.1.12": {
      "map": {
        "iconv-lite": "npm:iconv-lite@0.4.13"
      }
    },
    "github:jspm/nodelibs-domain@0.2.0-alpha": {
      "map": {
        "domain-browserify": "npm:domain-browser@1.1.7"
      }
    },
    "npm:babel-plugin-transform-react-jsx@6.8.0": {
      "map": {
        "babel-helper-builder-react-jsx": "npm:babel-helper-builder-react-jsx@6.9.0",
        "babel-plugin-syntax-jsx": "npm:babel-plugin-syntax-jsx@6.13.0",
        "babel-runtime": "npm:babel-runtime@6.11.6"
      }
    },
    "npm:babel-helper-builder-react-jsx@6.9.0": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.11.6",
        "lodash": "npm:lodash@4.15.0",
        "babel-types": "npm:babel-types@6.15.0",
        "esutils": "npm:esutils@2.0.2"
      }
    },
    "npm:babel-runtime@6.11.6": {
      "map": {
        "regenerator-runtime": "npm:regenerator-runtime@0.9.5",
        "core-js": "npm:core-js@2.4.1"
      }
    },
    "npm:babel-types@6.15.0": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.11.6",
        "esutils": "npm:esutils@2.0.2",
        "lodash": "npm:lodash@4.15.0",
        "to-fast-properties": "npm:to-fast-properties@1.0.2"
      }
    },
    "github:jspm/nodelibs-timers@0.2.0-alpha": {
      "map": {
        "timers-browserify": "npm:timers-browserify@1.4.2"
      }
    },
    "npm:timers-browserify@1.4.2": {
      "map": {
        "process": "npm:process@0.11.9"
      }
    },
    "github:MeoMix/jspm-loader-css@master": {
      "map": {
        "cssnano": "npm:cssnano@3.7.4",
        "node-cssnano": "npm:cssnano@3.7.4",
        "css-modules-loader-core": "npm:css-modules-loader-core@1.0.1"
      }
    },
    "npm:cssnano@3.7.4": {
      "map": {
        "decamelize": "npm:decamelize@1.2.0",
        "postcss-colormin": "npm:postcss-colormin@2.2.0",
        "postcss-minify-params": "npm:postcss-minify-params@1.0.5",
        "postcss-filter-plugins": "npm:postcss-filter-plugins@2.0.1",
        "postcss-minify-selectors": "npm:postcss-minify-selectors@2.0.5",
        "postcss-merge-rules": "npm:postcss-merge-rules@2.0.10",
        "postcss": "npm:postcss@5.2.0",
        "postcss-reduce-idents": "npm:postcss-reduce-idents@2.3.0",
        "postcss-discard-overridden": "npm:postcss-discard-overridden@0.1.1",
        "has": "npm:has@1.0.1",
        "postcss-ordered-values": "npm:postcss-ordered-values@2.2.1",
        "postcss-discard-duplicates": "npm:postcss-discard-duplicates@2.0.1",
        "postcss-reduce-initial": "npm:postcss-reduce-initial@1.0.0",
        "postcss-convert-values": "npm:postcss-convert-values@2.4.0",
        "postcss-normalize-charset": "npm:postcss-normalize-charset@1.1.0",
        "postcss-svgo": "npm:postcss-svgo@2.1.4",
        "postcss-merge-longhand": "npm:postcss-merge-longhand@2.0.1",
        "postcss-calc": "npm:postcss-calc@5.3.1",
        "postcss-normalize-url": "npm:postcss-normalize-url@3.0.7",
        "autoprefixer": "npm:autoprefixer@6.4.1",
        "postcss-unique-selectors": "npm:postcss-unique-selectors@2.0.2",
        "postcss-zindex": "npm:postcss-zindex@2.1.1",
        "postcss-reduce-transforms": "npm:postcss-reduce-transforms@1.0.3",
        "postcss-minify-font-values": "npm:postcss-minify-font-values@1.0.5",
        "postcss-discard-empty": "npm:postcss-discard-empty@2.1.0",
        "postcss-minify-gradients": "npm:postcss-minify-gradients@1.0.3",
        "postcss-merge-idents": "npm:postcss-merge-idents@2.1.7",
        "postcss-discard-unused": "npm:postcss-discard-unused@2.2.1",
        "object-assign": "npm:object-assign@4.1.0",
        "defined": "npm:defined@1.0.0",
        "postcss-discard-comments": "npm:postcss-discard-comments@2.0.4",
        "postcss-value-parser": "npm:postcss-value-parser@3.3.0"
      }
    },
    "npm:css-modules-loader-core@1.0.1": {
      "map": {
        "postcss": "npm:postcss@5.1.2",
        "icss-replace-symbols": "npm:icss-replace-symbols@1.0.2",
        "postcss-modules-extract-imports": "npm:postcss-modules-extract-imports@1.0.0",
        "postcss-modules-local-by-default": "npm:postcss-modules-local-by-default@1.1.1",
        "postcss-modules-scope": "npm:postcss-modules-scope@1.0.2",
        "postcss-modules-values": "npm:postcss-modules-values@1.2.2"
      }
    },
    "npm:postcss-filter-plugins@2.0.1": {
      "map": {
        "postcss": "npm:postcss@5.2.0",
        "uniqid": "npm:uniqid@3.1.0"
      }
    },
    "npm:postcss-minify-params@1.0.5": {
      "map": {
        "postcss": "npm:postcss@5.2.0",
        "postcss-value-parser": "npm:postcss-value-parser@3.3.0",
        "alphanum-sort": "npm:alphanum-sort@1.0.2",
        "uniqs": "npm:uniqs@2.0.0"
      }
    },
    "npm:postcss-colormin@2.2.0": {
      "map": {
        "postcss": "npm:postcss@5.2.0",
        "colormin": "npm:colormin@1.1.2",
        "postcss-value-parser": "npm:postcss-value-parser@3.3.0"
      }
    },
    "npm:postcss-merge-rules@2.0.10": {
      "map": {
        "postcss": "npm:postcss@5.2.0",
        "vendors": "npm:vendors@1.0.1"
      }
    },
    "npm:postcss-reduce-idents@2.3.0": {
      "map": {
        "postcss": "npm:postcss@5.2.0",
        "postcss-value-parser": "npm:postcss-value-parser@3.3.0"
      }
    },
    "npm:postcss-minify-selectors@2.0.5": {
      "map": {
        "postcss": "npm:postcss@5.2.0",
        "alphanum-sort": "npm:alphanum-sort@1.0.2",
        "postcss-selector-parser": "npm:postcss-selector-parser@2.2.1"
      }
    },
    "npm:postcss-discard-overridden@0.1.1": {
      "map": {
        "postcss": "npm:postcss@5.2.0"
      }
    },
    "npm:postcss-ordered-values@2.2.1": {
      "map": {
        "postcss": "npm:postcss@5.2.0",
        "postcss-value-parser": "npm:postcss-value-parser@3.3.0"
      }
    },
    "npm:postcss-normalize-charset@1.1.0": {
      "map": {
        "postcss": "npm:postcss@5.2.0"
      }
    },
    "npm:postcss-svgo@2.1.4": {
      "map": {
        "postcss": "npm:postcss@5.2.0",
        "is-svg": "npm:is-svg@2.0.1",
        "svgo": "npm:svgo@0.6.6",
        "postcss-value-parser": "npm:postcss-value-parser@3.3.0"
      }
    },
    "npm:postcss-discard-duplicates@2.0.1": {
      "map": {
        "postcss": "npm:postcss@5.2.0"
      }
    },
    "npm:postcss-convert-values@2.4.0": {
      "map": {
        "postcss": "npm:postcss@5.2.0",
        "postcss-value-parser": "npm:postcss-value-parser@3.3.0"
      }
    },
    "npm:postcss-reduce-initial@1.0.0": {
      "map": {
        "postcss": "npm:postcss@5.2.0"
      }
    },
    "npm:postcss-merge-longhand@2.0.1": {
      "map": {
        "postcss": "npm:postcss@5.2.0"
      }
    },
    "npm:autoprefixer@6.4.1": {
      "map": {
        "postcss": "npm:postcss@5.2.0",
        "num2fraction": "npm:num2fraction@1.2.2",
        "browserslist": "npm:browserslist@1.3.6",
        "caniuse-db": "npm:caniuse-db@1.0.30000528",
        "normalize-range": "npm:normalize-range@0.1.2",
        "postcss-value-parser": "npm:postcss-value-parser@3.3.0"
      }
    },
    "npm:postcss-calc@5.3.1": {
      "map": {
        "postcss": "npm:postcss@5.2.0",
        "reduce-css-calc": "npm:reduce-css-calc@1.3.0",
        "postcss-message-helpers": "npm:postcss-message-helpers@2.0.0"
      }
    },
    "npm:postcss-normalize-url@3.0.7": {
      "map": {
        "postcss": "npm:postcss@5.2.0",
        "is-absolute-url": "npm:is-absolute-url@2.0.0",
        "postcss-value-parser": "npm:postcss-value-parser@3.3.0",
        "normalize-url": "npm:normalize-url@1.6.1"
      }
    },
    "npm:postcss-unique-selectors@2.0.2": {
      "map": {
        "postcss": "npm:postcss@5.2.0",
        "alphanum-sort": "npm:alphanum-sort@1.0.2",
        "uniqs": "npm:uniqs@2.0.0"
      }
    },
    "npm:postcss-zindex@2.1.1": {
      "map": {
        "postcss": "npm:postcss@5.2.0",
        "uniqs": "npm:uniqs@2.0.0"
      }
    },
    "npm:postcss-minify-font-values@1.0.5": {
      "map": {
        "object-assign": "npm:object-assign@4.1.0",
        "postcss": "npm:postcss@5.2.0",
        "postcss-value-parser": "npm:postcss-value-parser@3.3.0"
      }
    },
    "npm:postcss-minify-gradients@1.0.3": {
      "map": {
        "postcss": "npm:postcss@5.2.0",
        "postcss-value-parser": "npm:postcss-value-parser@3.3.0"
      }
    },
    "npm:postcss-reduce-transforms@1.0.3": {
      "map": {
        "postcss": "npm:postcss@5.2.0",
        "postcss-value-parser": "npm:postcss-value-parser@3.3.0"
      }
    },
    "npm:postcss-merge-idents@2.1.7": {
      "map": {
        "has": "npm:has@1.0.1",
        "postcss": "npm:postcss@5.2.0",
        "postcss-value-parser": "npm:postcss-value-parser@3.3.0"
      }
    },
    "npm:postcss-discard-empty@2.1.0": {
      "map": {
        "postcss": "npm:postcss@5.2.0"
      }
    },
    "npm:postcss-discard-unused@2.2.1": {
      "map": {
        "postcss": "npm:postcss@5.2.0",
        "uniqs": "npm:uniqs@2.0.0",
        "flatten": "npm:flatten@1.0.2"
      }
    },
    "npm:postcss@5.2.0": {
      "map": {
        "supports-color": "npm:supports-color@3.1.2",
        "source-map": "npm:source-map@0.5.6",
        "js-base64": "npm:js-base64@2.1.9"
      }
    },
    "npm:postcss@5.1.2": {
      "map": {
        "supports-color": "npm:supports-color@3.1.2",
        "source-map": "npm:source-map@0.5.6",
        "js-base64": "npm:js-base64@2.1.9"
      }
    },
    "npm:has@1.0.1": {
      "map": {
        "function-bind": "npm:function-bind@1.1.0"
      }
    },
    "npm:postcss-discard-comments@2.0.4": {
      "map": {
        "postcss": "npm:postcss@5.2.0"
      }
    },
    "npm:colormin@1.1.2": {
      "map": {
        "has": "npm:has@1.0.1",
        "color": "npm:color@0.11.3",
        "css-color-names": "npm:css-color-names@0.0.4"
      }
    },
    "npm:browserslist@1.3.6": {
      "map": {
        "caniuse-db": "npm:caniuse-db@1.0.30000528"
      }
    },
    "npm:postcss-modules-extract-imports@1.0.0": {
      "map": {
        "postcss": "npm:postcss@5.2.0"
      }
    },
    "npm:postcss-modules-scope@1.0.2": {
      "map": {
        "postcss": "npm:postcss@5.2.0",
        "css-selector-tokenizer": "npm:css-selector-tokenizer@0.6.0"
      }
    },
    "npm:postcss-modules-local-by-default@1.1.1": {
      "map": {
        "postcss": "npm:postcss@5.2.0",
        "css-selector-tokenizer": "npm:css-selector-tokenizer@0.6.0"
      }
    },
    "npm:supports-color@3.1.2": {
      "map": {
        "has-flag": "npm:has-flag@1.0.0"
      }
    },
    "npm:reduce-css-calc@1.3.0": {
      "map": {
        "math-expression-evaluator": "npm:math-expression-evaluator@1.2.14",
        "balanced-match": "npm:balanced-match@0.4.2",
        "reduce-function-call": "npm:reduce-function-call@1.0.1"
      }
    },
    "npm:is-svg@2.0.1": {
      "map": {
        "html-comment-regex": "npm:html-comment-regex@1.1.1"
      }
    },
    "npm:normalize-url@1.6.1": {
      "map": {
        "object-assign": "npm:object-assign@4.1.0",
        "query-string": "npm:query-string@4.2.3",
        "prepend-http": "npm:prepend-http@1.0.4",
        "sort-keys": "npm:sort-keys@1.1.2"
      }
    },
    "npm:svgo@0.6.6": {
      "map": {
        "whet.extend": "npm:whet.extend@0.9.9",
        "js-yaml": "npm:js-yaml@3.6.1",
        "coa": "npm:coa@1.0.1",
        "mkdirp": "npm:mkdirp@0.5.1",
        "colors": "npm:colors@1.1.2",
        "csso": "npm:csso@2.0.0",
        "sax": "npm:sax@1.2.1"
      }
    },
    "npm:uniqid@3.1.0": {
      "map": {
        "macaddress": "npm:macaddress@0.2.8"
      }
    },
    "npm:csso@2.0.0": {
      "map": {
        "source-map": "npm:source-map@0.5.6",
        "clap": "npm:clap@1.1.1"
      }
    },
    "npm:postcss-modules-values@1.2.2": {
      "map": {
        "icss-replace-symbols": "npm:icss-replace-symbols@1.0.2",
        "postcss": "npm:postcss@5.2.0"
      }
    },
    "npm:math-expression-evaluator@1.2.14": {
      "map": {
        "lodash.indexof": "npm:lodash.indexof@4.0.5"
      }
    },
    "npm:color@0.11.3": {
      "map": {
        "color-string": "npm:color-string@0.3.0",
        "color-convert": "npm:color-convert@1.5.0",
        "clone": "npm:clone@1.0.2"
      }
    },
    "npm:css-selector-tokenizer@0.6.0": {
      "map": {
        "fastparse": "npm:fastparse@1.1.1",
        "regexpu-core": "npm:regexpu-core@1.0.0",
        "cssesc": "npm:cssesc@0.1.0"
      }
    },
    "npm:query-string@4.2.3": {
      "map": {
        "object-assign": "npm:object-assign@4.1.0",
        "strict-uri-encode": "npm:strict-uri-encode@1.1.0"
      }
    },
    "npm:coa@1.0.1": {
      "map": {
        "q": "npm:q@1.4.1"
      }
    },
    "npm:js-yaml@3.6.1": {
      "map": {
        "argparse": "npm:argparse@1.0.7",
        "esprima": "npm:esprima@2.7.3"
      }
    },
    "npm:mkdirp@0.5.1": {
      "map": {
        "minimist": "npm:minimist@0.0.8"
      }
    },
    "npm:postcss-selector-parser@2.2.1": {
      "map": {
        "flatten": "npm:flatten@1.0.2",
        "indexes-of": "npm:indexes-of@1.0.1",
        "uniq": "npm:uniq@1.0.1"
      }
    },
    "npm:color-string@0.3.0": {
      "map": {
        "color-name": "npm:color-name@1.1.1"
      }
    },
    "npm:reduce-function-call@1.0.1": {
      "map": {
        "balanced-match": "npm:balanced-match@0.1.0"
      }
    },
    "npm:regexpu-core@1.0.0": {
      "map": {
        "regjsparser": "npm:regjsparser@0.1.5",
        "regjsgen": "npm:regjsgen@0.2.0",
        "regenerate": "npm:regenerate@1.3.1"
      }
    },
    "npm:clap@1.1.1": {
      "map": {
        "chalk": "npm:chalk@1.1.3"
      }
    },
    "npm:argparse@1.0.7": {
      "map": {
        "sprintf-js": "npm:sprintf-js@1.0.3"
      }
    },
    "npm:chalk@1.1.3": {
      "map": {
        "supports-color": "npm:supports-color@2.0.0",
        "ansi-styles": "npm:ansi-styles@2.2.1",
        "has-ansi": "npm:has-ansi@2.0.0",
        "escape-string-regexp": "npm:escape-string-regexp@1.0.5",
        "strip-ansi": "npm:strip-ansi@3.0.1"
      }
    },
    "npm:regjsparser@0.1.5": {
      "map": {
        "jsesc": "npm:jsesc@0.5.0"
      }
    },
    "npm:sort-keys@1.1.2": {
      "map": {
        "is-plain-obj": "npm:is-plain-obj@1.1.0"
      }
    },
    "npm:has-ansi@2.0.0": {
      "map": {
        "ansi-regex": "npm:ansi-regex@2.0.0"
      }
    },
    "npm:strip-ansi@3.0.1": {
      "map": {
        "ansi-regex": "npm:ansi-regex@2.0.0"
      }
    }
  }
});
