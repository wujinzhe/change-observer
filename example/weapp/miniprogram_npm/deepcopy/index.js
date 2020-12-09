module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1606721446635, function(require, module, exports) {
module.exports = require('./cjs/index.js').default;

}, function(modId) {var map = {"./cjs/index.js":1606721446636}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1606721446636, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = deepcopy;

var _detector = require("./detector.js");

var _collection = require("./collection.js");

var _copier = require("./copier.js");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

/**
 * deepcopy function
 *
 * @param {*} value
 * @param {Object|Function} [options]
 * @return {*}
 */
function deepcopy(value, options = {}) {
  if (typeof options === 'function') {
    options = {
      customizer: options
    };
  }

  const _options = options,
        customizer = _options.customizer;
  const valueType = (0, _detector.detectType)(value);

  if (!(0, _collection.isCollection)(valueType)) {
    return recursiveCopy(value, null, null, null, customizer);
  }

  const copiedValue = (0, _copier.copy)(value, valueType, customizer);
  const references = new WeakMap([[value, copiedValue]]);
  const visited = new WeakSet([value]);
  return recursiveCopy(value, copiedValue, references, visited, customizer);
}
/**
 * recursively copy
 *
 * @param {*} value target value
 * @param {*} clone clone of value
 * @param {WeakMap} references visited references of clone
 * @param {WeakSet} visited visited references of value
 * @param {Function} customizer user customize function
 * @return {*}
 */


function recursiveCopy(value, clone, references, visited, customizer) {
  const type = (0, _detector.detectType)(value);
  const copiedValue = (0, _copier.copy)(value, type); // return if not a collection value

  if (!(0, _collection.isCollection)(type)) {
    return copiedValue;
  }

  let keys;

  switch (type) {
    case 'Arguments':
    case 'Array':
      keys = Object.keys(value);
      break;

    case 'Object':
      keys = Object.keys(value);
      keys.push(...Object.getOwnPropertySymbols(value));
      break;

    case 'Map':
    case 'Set':
      keys = value.keys();
      break;

    default:
  } // walk within collection with iterator


  var _iterator = _createForOfIteratorHelper(keys),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      let collectionKey = _step.value;
      const collectionValue = (0, _collection.get)(value, collectionKey, type);

      if (visited.has(collectionValue)) {
        // for [Circular]
        (0, _collection.set)(clone, collectionKey, references.get(collectionValue), type);
      } else {
        const collectionValueType = (0, _detector.detectType)(collectionValue);
        const copiedCollectionValue = (0, _copier.copy)(collectionValue, collectionValueType); // save reference if value is collection

        if ((0, _collection.isCollection)(collectionValueType)) {
          references.set(collectionValue, copiedCollectionValue);
          visited.add(collectionValue);
        }

        (0, _collection.set)(clone, collectionKey, recursiveCopy(collectionValue, copiedCollectionValue, references, visited, customizer), type);
      }
    } // TODO: isSealed/isFrozen/isExtensible

  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return clone;
}
//# sourceMappingURL=index.js.map
}, function(modId) { var map = {"./detector.js":1606721446637,"./collection.js":1606721446639,"./copier.js":1606721446640}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1606721446637, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.detectType = detectType;

var _typeDetect = _interopRequireDefault(require("type-detect"));

var _buffer = require("./buffer.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * detect type of value
 *
 * @param {*} value
 * @return {string}
 */
function detectType(value) {
  // NOTE: isBuffer must execute before type-detect,
  // because type-detect returns 'Uint8Array'.
  if ((0, _buffer.isBuffer)(value)) {
    return 'Buffer';
  }

  return (0, _typeDetect.default)(value);
}
//# sourceMappingURL=detector.js.map
}, function(modId) { var map = {"./buffer.js":1606721446638}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1606721446638, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copy = exports.isBuffer = void 0;
const isBufferExists = typeof Buffer !== 'undefined';
const isBufferFromExists = isBufferExists && typeof Buffer.from !== 'undefined';
const isBuffer = isBufferExists ?
/**
 * is value is Buffer?
 *
 * @param {*} value
 * @return {boolean}
 */
function isBuffer(value) {
  return Buffer.isBuffer(value);
} :
/**
 * return false
 *
 * NOTE: for Buffer unsupported
 *
 * @return {boolean}
 */
function isBuffer() {
  return false;
};
exports.isBuffer = isBuffer;
const copy = isBufferFromExists ?
/**
 * copy Buffer
 *
 * @param {Buffer} value
 * @return {Buffer}
 */
function copy(value) {
  return Buffer.from(value);
} : isBufferExists ?
/**
 * copy Buffer
 *
 * NOTE: for old node.js
 *
 * @param {Buffer} value
 * @return {Buffer}
 */
function copy(value) {
  return new Buffer(value);
} :
/**
 * shallow copy
 *
 * NOTE: for Buffer unsupported
 *
 * @param {*}
 * @return {*}
 */
function copy(value) {
  return value;
};
exports.copy = copy;
//# sourceMappingURL=buffer.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1606721446639, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.isCollection = isCollection;
exports.set = set;

var _detector = require("./detector.js");

/**
 * collection types
 */
const collectionTypeSet = new Set(['Arguments', 'Array', 'Map', 'Object', 'Set']);
/**
 * get value from collection
 *
 * @param {Array|Object|Map|Set} collection
 * @param {string|number|symbol} key
 * @param {string} [type=null]
 * @return {*}
 */

function get(collection, key, type = null) {
  const valueType = type || (0, _detector.detectType)(collection);

  switch (valueType) {
    case 'Arguments':
    case 'Array':
    case 'Object':
      return collection[key];

    case 'Map':
      return collection.get(key);

    case 'Set':
      // NOTE: Set.prototype.keys is alias of Set.prototype.values
      // it means key is equals value
      return key;

    default:
  }
}
/**
 * check to type string is collection
 *
 * @param {string} type
 */


function isCollection(type) {
  return collectionTypeSet.has(type);
}
/**
 * set value to collection
 *
 * @param {Array|Object|Map|Set} collection
 * @param {string|number|symbol} key
 * @param {*} value
 * @param {string} [type=null]
 * @return {Array|Object|Map|Set}
 */


function set(collection, key, value, type = null) {
  const valueType = type || (0, _detector.detectType)(collection);

  switch (valueType) {
    case 'Arguments':
    case 'Array':
    case 'Object':
      collection[key] = value;
      break;

    case 'Map':
      collection.set(key, value);
      break;

    case 'Set':
      collection.add(value);
      break;

    default:
  }

  return collection;
}
//# sourceMappingURL=collection.js.map
}, function(modId) { var map = {"./detector.js":1606721446637}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1606721446640, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copy = copy;

var _copy_map = _interopRequireDefault(require("./copy_map.js"));

var _detector = require("./detector.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * no operation
 */
function noop() {}
/**
 * copy value
 *
 * @param {*} value
 * @param {string} [type=null]
 * @param {Function} [customizer=noop]
 * @return {*}
 */


function copy(value, type = null, customizer = noop) {
  if (arguments.length === 2 && typeof type === 'function') {
    customizer = type;
    type = null;
  }

  const valueType = type || (0, _detector.detectType)(value);

  const copyFunction = _copy_map.default.get(valueType);

  if (valueType === 'Object') {
    const result = customizer(value, valueType);

    if (result !== undefined) {
      return result;
    }
  } // NOTE: TypedArray needs pass type to argument


  return copyFunction ? copyFunction(value, valueType) : value;
}
//# sourceMappingURL=copier.js.map
}, function(modId) { var map = {"./copy_map.js":1606721446641,"./detector.js":1606721446637}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1606721446641, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _buffer = require("./buffer.js");

var _global = require("./global.js");

/**
 * copy ArrayBuffer
 *
 * @param {ArrayBuffer} value
 * @return {ArrayBuffer}
 */
function copyArrayBuffer(value) {
  return value.slice(0);
}
/**
 * copy Boolean
 *
 * @param {Boolean} value
 * @return {Boolean}
 */


function copyBoolean(value) {
  return new Boolean(value.valueOf());
}
/**
 * copy DataView
 *
 * @param {DataView} value
 * @return {DataView}
 */


function copyDataView(value) {
  // TODO: copy ArrayBuffer?
  return new DataView(value.buffer);
}
/**
 * copy Buffer
 *
 * @param {Buffer} value
 * @return {Buffer}
 */


function copyBuffer(value) {
  return (0, _buffer.copy)(value);
}
/**
 * copy Date
 *
 * @param {Date} value
 * @return {Date}
 */


function copyDate(value) {
  return new Date(value.getTime());
}
/**
 * copy Number
 *
 * @param {Number} value
 * @return {Number}
 */


function copyNumber(value) {
  return new Number(value);
}
/**
 * copy RegExp
 *
 * @param {RegExp} value
 * @return {RegExp}
 */


function copyRegExp(value) {
  return new RegExp(value.source, value.flags);
}
/**
 * copy String
 *
 * @param {String} value
 * @return {String}
 */


function copyString(value) {
  return new String(value);
}
/**
 * copy TypedArray
 *
 * @param {*} value
 * @return {*}
 */


function copyTypedArray(value, type) {
  const typedArray = _global.globalObject[type];

  if (typedArray.from) {
    return _global.globalObject[type].from(value);
  }

  return new _global.globalObject[type](value);
}
/**
 * shallow copy
 *
 * @param {*} value
 * @return {*}
 */


function shallowCopy(value) {
  return value;
}
/**
 * get empty Array
 *
 * @return {Array}
 */


function getEmptyArray() {
  return [];
}
/**
 * get empty Map
 *
 * @return {Map}
 */


function getEmptyMap() {
  return new Map();
}
/**
 * get empty Object
 *
 * @return {Object}
 */


function getEmptyObject() {
  return {};
}
/**
 * get empty Set
 *
 * @return {Set}
 */


function getEmptySet() {
  return new Set();
}

var _default = new Map([// deep copy
['ArrayBuffer', copyArrayBuffer], ['Boolean', copyBoolean], ['Buffer', copyBuffer], ['DataView', copyDataView], ['Date', copyDate], ['Number', copyNumber], ['RegExp', copyRegExp], ['String', copyString], // typed arrays
// TODO: pass bound function
['Float32Array', copyTypedArray], ['Float64Array', copyTypedArray], ['Int16Array', copyTypedArray], ['Int32Array', copyTypedArray], ['Int8Array', copyTypedArray], ['Uint16Array', copyTypedArray], ['Uint32Array', copyTypedArray], ['Uint8Array', copyTypedArray], ['Uint8ClampedArray', copyTypedArray], // shallow copy
['Array Iterator', shallowCopy], ['Map Iterator', shallowCopy], ['Promise', shallowCopy], ['Set Iterator', shallowCopy], ['String Iterator', shallowCopy], ['function', shallowCopy], ['global', shallowCopy], // NOTE: WeakMap and WeakSet cannot get entries
['WeakMap', shallowCopy], ['WeakSet', shallowCopy], // primitives
['boolean', shallowCopy], ['null', shallowCopy], ['number', shallowCopy], ['string', shallowCopy], ['symbol', shallowCopy], ['undefined', shallowCopy], // collections
// NOTE: return empty value, because recursively copy later.
['Arguments', getEmptyArray], ['Array', getEmptyArray], ['Map', getEmptyMap], ['Object', getEmptyObject], ['Set', getEmptySet] // NOTE: type-detect returns following types
// 'Location'
// 'Document'
// 'MimeTypeArray'
// 'PluginArray'
// 'HTMLQuoteElement'
// 'HTMLTableDataCellElement'
// 'HTMLTableHeaderCellElement'
// TODO: is type-detect never return 'object'?
// 'object'
]);

exports.default = _default;
//# sourceMappingURL=copy_map.js.map
}, function(modId) { var map = {"./buffer.js":1606721446638,"./global.js":1606721446642}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1606721446642, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.globalObject = void 0;
const freeGlobalThis = typeof globalThis !== 'undefined' && globalThis !== null && globalThis.Object === Object && globalThis;
const freeGlobal = typeof global !== 'undefined' && global !== null && global.Object === Object && global;
const freeSelf = typeof self !== 'undefined' && self !== null && self.Object === Object && self;
const globalObject = freeGlobalThis || freeGlobal || freeSelf || Function('return this')();
exports.globalObject = globalObject;
//# sourceMappingURL=global.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1606721446635);
})()
//# sourceMappingURL=index.js.map