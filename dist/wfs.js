(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Wfs = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],2:[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./_wks')('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) require('./_hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};

},{"./_hide":21,"./_wks":53}],3:[function(require,module,exports){
'use strict';
var at = require('./_string-at')(true);

 // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};

},{"./_string-at":45}],4:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":25}],5:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"./_to-absolute-index":46,"./_to-iobject":48,"./_to-length":49}],6:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof');
var TAG = require('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":7,"./_wks":53}],7:[function(require,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],8:[function(require,module,exports){
var core = module.exports = { version: '2.6.10' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],9:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":1}],10:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],11:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":15}],12:[function(require,module,exports){
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":19,"./_is-object":25}],13:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],14:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var hide = require('./_hide');
var redefine = require('./_redefine');
var ctx = require('./_ctx');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_core":8,"./_ctx":9,"./_global":19,"./_hide":21,"./_redefine":38}],15:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],16:[function(require,module,exports){
'use strict';
require('./es6.regexp.exec');
var redefine = require('./_redefine');
var hide = require('./_hide');
var fails = require('./_fails');
var defined = require('./_defined');
var wks = require('./_wks');
var regexpExec = require('./_regexp-exec');

var SPECIES = wks('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
})();

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    re.exec = function () { execCalled = true; return null; };
    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
    }
    re[SYMBOL]('');
    return !execCalled;
  }) : undefined;

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var fns = exec(
      defined,
      SYMBOL,
      ''[KEY],
      function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      }
    );
    var strfn = fns[0];
    var rxfn = fns[1];

    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};

},{"./_defined":10,"./_fails":15,"./_hide":21,"./_redefine":38,"./_regexp-exec":40,"./_wks":53,"./es6.regexp.exec":56}],17:[function(require,module,exports){
'use strict';
// 21.2.5.3 get RegExp.prototype.flags
var anObject = require('./_an-object');
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

},{"./_an-object":4}],18:[function(require,module,exports){
module.exports = require('./_shared')('native-function-to-string', Function.toString);

},{"./_shared":43}],19:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],20:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],21:[function(require,module,exports){
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":11,"./_object-dp":32,"./_property-desc":37}],22:[function(require,module,exports){
var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":19}],23:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":11,"./_dom-create":12,"./_fails":15}],24:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":7}],25:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],26:[function(require,module,exports){
'use strict';
var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_hide":21,"./_object-create":31,"./_property-desc":37,"./_set-to-string-tag":41,"./_wks":53}],27:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_export":14,"./_hide":21,"./_iter-create":26,"./_iterators":29,"./_library":30,"./_object-gpo":34,"./_redefine":38,"./_set-to-string-tag":41,"./_wks":53}],28:[function(require,module,exports){
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],29:[function(require,module,exports){
module.exports = {};

},{}],30:[function(require,module,exports){
module.exports = false;

},{}],31:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":4,"./_dom-create":12,"./_enum-bug-keys":13,"./_html":22,"./_object-dps":33,"./_shared-key":42}],32:[function(require,module,exports){
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":4,"./_descriptors":11,"./_ie8-dom-define":23,"./_to-primitive":51}],33:[function(require,module,exports){
var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_an-object":4,"./_descriptors":11,"./_object-dp":32,"./_object-keys":36}],34:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

},{"./_has":20,"./_shared-key":42,"./_to-object":50}],35:[function(require,module,exports){
var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_array-includes":5,"./_has":20,"./_shared-key":42,"./_to-iobject":48}],36:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":13,"./_object-keys-internal":35}],37:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],38:[function(require,module,exports){
var global = require('./_global');
var hide = require('./_hide');
var has = require('./_has');
var SRC = require('./_uid')('src');
var $toString = require('./_function-to-string');
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);

require('./_core').inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

},{"./_core":8,"./_function-to-string":18,"./_global":19,"./_has":20,"./_hide":21,"./_uid":52}],39:[function(require,module,exports){
'use strict';

var classof = require('./_classof');
var builtinExec = RegExp.prototype.exec;

 // `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw new TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }
  if (classof(R) !== 'RegExp') {
    throw new TypeError('RegExp#exec called on incompatible receiver');
  }
  return builtinExec.call(R, S);
};

},{"./_classof":6}],40:[function(require,module,exports){
'use strict';

var regexpFlags = require('./_flags');

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var LAST_INDEX = 'lastIndex';

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/,
      re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      // eslint-disable-next-line no-loop-func
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;

},{"./_flags":17}],41:[function(require,module,exports){
var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":20,"./_object-dp":32,"./_wks":53}],42:[function(require,module,exports){
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":43,"./_uid":52}],43:[function(require,module,exports){
var core = require('./_core');
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: require('./_library') ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});

},{"./_core":8,"./_global":19,"./_library":30}],44:[function(require,module,exports){
'use strict';
var fails = require('./_fails');

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
  });
};

},{"./_fails":15}],45:[function(require,module,exports){
var toInteger = require('./_to-integer');
var defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_defined":10,"./_to-integer":47}],46:[function(require,module,exports){
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":47}],47:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],48:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":10,"./_iobject":24}],49:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":47}],50:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":10}],51:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":25}],52:[function(require,module,exports){
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],53:[function(require,module,exports){
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":19,"./_shared":43,"./_uid":52}],54:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables');
var step = require('./_iter-step');
var Iterators = require('./_iterators');
var toIObject = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"./_add-to-unscopables":2,"./_iter-define":27,"./_iter-step":28,"./_iterators":29,"./_to-iobject":48}],55:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var aFunction = require('./_a-function');
var toObject = require('./_to-object');
var fails = require('./_fails');
var $sort = [].sort;
var test = [1, 2, 3];

$export($export.P + $export.F * (fails(function () {
  // IE8-
  test.sort(undefined);
}) || !fails(function () {
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !require('./_strict-method')($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? $sort.call(toObject(this))
      : $sort.call(toObject(this), aFunction(comparefn));
  }
});

},{"./_a-function":1,"./_export":14,"./_fails":15,"./_strict-method":44,"./_to-object":50}],56:[function(require,module,exports){
'use strict';
var regexpExec = require('./_regexp-exec');
require('./_export')({
  target: 'RegExp',
  proto: true,
  forced: regexpExec !== /./.exec
}, {
  exec: regexpExec
});

},{"./_export":14,"./_regexp-exec":40}],57:[function(require,module,exports){
// 21.2.5.3 get RegExp.prototype.flags()
if (require('./_descriptors') && /./g.flags != 'g') require('./_object-dp').f(RegExp.prototype, 'flags', {
  configurable: true,
  get: require('./_flags')
});

},{"./_descriptors":11,"./_flags":17,"./_object-dp":32}],58:[function(require,module,exports){
'use strict';

var anObject = require('./_an-object');
var toLength = require('./_to-length');
var advanceStringIndex = require('./_advance-string-index');
var regExpExec = require('./_regexp-exec-abstract');

// @@match logic
require('./_fix-re-wks')('match', 1, function (defined, MATCH, $match, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = defined(this);
      var fn = regexp == undefined ? undefined : regexp[MATCH];
      return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
    function (regexp) {
      var res = maybeCallNative($match, regexp, this);
      if (res.done) return res.value;
      var rx = anObject(regexp);
      var S = String(this);
      if (!rx.global) return regExpExec(rx, S);
      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regExpExec(rx, S)) !== null) {
        var matchStr = String(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});

},{"./_advance-string-index":3,"./_an-object":4,"./_fix-re-wks":16,"./_regexp-exec-abstract":39,"./_to-length":49}],59:[function(require,module,exports){
'use strict';

var anObject = require('./_an-object');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var toInteger = require('./_to-integer');
var advanceStringIndex = require('./_advance-string-index');
var regExpExec = require('./_regexp-exec-abstract');
var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
require('./_fix-re-wks')('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = defined(this);
      var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
      return fn !== undefined
        ? fn.call(searchValue, O, replaceValue)
        : $replace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      var res = maybeCallNative($replace, regexp, this, replaceValue);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);
      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;
        results.push(result);
        if (!global) break;
        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }
      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];
        var matched = String(result[0]);
        var position = max(min(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

    // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return $replace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});

},{"./_advance-string-index":3,"./_an-object":4,"./_fix-re-wks":16,"./_regexp-exec-abstract":39,"./_to-integer":47,"./_to-length":49,"./_to-object":50}],60:[function(require,module,exports){
'use strict';
require('./es6.regexp.flags');
var anObject = require('./_an-object');
var $flags = require('./_flags');
var DESCRIPTORS = require('./_descriptors');
var TO_STRING = 'toString';
var $toString = /./[TO_STRING];

var define = function (fn) {
  require('./_redefine')(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if (require('./_fails')(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
  define(function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if ($toString.name != TO_STRING) {
  define(function toString() {
    return $toString.call(this);
  });
}

},{"./_an-object":4,"./_descriptors":11,"./_fails":15,"./_flags":17,"./_redefine":38,"./es6.regexp.flags":57}],61:[function(require,module,exports){
var $iterators = require('./es6.array.iterator');
var getKeys = require('./_object-keys');
var redefine = require('./_redefine');
var global = require('./_global');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var wks = require('./_wks');
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}

},{"./_global":19,"./_hide":21,"./_iterators":29,"./_object-keys":36,"./_redefine":38,"./_wks":53,"./es6.array.iterator":54}],62:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var objectCreate = Object.create || objectCreatePolyfill
var objectKeys = Object.keys || objectKeysPolyfill
var bind = Function.prototype.bind || functionBindPolyfill

function EventEmitter() {
  if (!this._events || !Object.prototype.hasOwnProperty.call(this, '_events')) {
    this._events = objectCreate(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

var hasDefineProperty;
try {
  var o = {};
  if (Object.defineProperty) Object.defineProperty(o, 'x', { value: 0 });
  hasDefineProperty = o.x === 0;
} catch (err) { hasDefineProperty = false }
if (hasDefineProperty) {
  Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      // check whether the input is a positive number (whose value is zero or
      // greater and not a NaN).
      if (typeof arg !== 'number' || arg < 0 || arg !== arg)
        throw new TypeError('"defaultMaxListeners" must be a positive number');
      defaultMaxListeners = arg;
    }
  });
} else {
  EventEmitter.defaultMaxListeners = defaultMaxListeners;
}

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    if (arguments.length > 1)
      er = arguments[1];
    if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Unhandled "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
      // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
      // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = objectCreate(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
          listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
          prepend ? [listener, existing] : [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
            existing.length + ' "' + String(type) + '" listeners ' +
            'added. Use emitter.setMaxListeners() to ' +
            'increase limit.');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        if (typeof console === 'object' && console.warn) {
          console.warn('%s: %s', w.name, w.message);
        }
      }
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    switch (arguments.length) {
      case 0:
        return this.listener.call(this.target);
      case 1:
        return this.listener.call(this.target, arguments[0]);
      case 2:
        return this.listener.call(this.target, arguments[0], arguments[1]);
      case 3:
        return this.listener.call(this.target, arguments[0], arguments[1],
            arguments[2]);
      default:
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; ++i)
          args[i] = arguments[i];
        this.listener.apply(this.target, args);
    }
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = bind.call(onceWrapper, state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = objectCreate(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else
          spliceOne(list, position);

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = objectCreate(null);
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = objectCreate(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = objectKeys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = objectCreate(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (!events)
    return [];

  var evlistener = events[type];
  if (!evlistener)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function objectCreatePolyfill(proto) {
  var F = function() {};
  F.prototype = proto;
  return new F;
}
function objectKeysPolyfill(obj) {
  var keys = [];
  for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) {
    keys.push(k);
  }
  return k;
}
function functionBindPolyfill(context) {
  var fn = this;
  return function () {
    return fn.apply(context, arguments);
  };
}

},{}],63:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom.iterable");

var _events = _interopRequireDefault(require("../events"));

var _eventHandler = _interopRequireDefault(require("../event-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Buffer Controller
 */
class BufferController extends _eventHandler.default {
  constructor(wfs) {
    super(wfs, _events.default.MEDIA_ATTACHING, _events.default.BUFFER_APPENDING, _events.default.BUFFER_RESET);
    this.mediaSource = null;
    this.media = null;
    this.pendingTracks = {};
    this.sourceBuffer = {};
    this.segments = [];
    this.appended = 0;
    this._msDuration = null; // Source Buffer listeners

    this.onsbue = this.onSBUpdateEnd.bind(this);
    this.browserType = 0;

    if (navigator.userAgent.toLowerCase().indexOf('firefox') !== -1) {
      this.browserType = 1;
    }

    this.mediaType = 'H264Raw';
    this.websocketName = undefined;
    this.channelName = undefined;
  }

  destroy() {
    _eventHandler.default.prototype.destroy.call(this);
  }

  onMediaAttaching(data) {
    let media = this.media = data.media;
    this.mediaType = data.mediaType;
    this.websocketName = data.websocketName;
    this.channelName = data.channelName;

    if (media) {
      // setup the media source
      var ms = this.mediaSource = new MediaSource(); //Media Source listeners

      this.onmso = this.onMediaSourceOpen.bind(this);
      this.onmse = this.onMediaSourceEnded.bind(this);
      this.onmsc = this.onMediaSourceClose.bind(this);
      ms.addEventListener('sourceopen', this.onmso);
      ms.addEventListener('sourceended', this.onmse);
      ms.addEventListener('sourceclose', this.onmsc); // link video and media Source

      media.src = URL.createObjectURL(ms);
    }
  }

  onMediaDetaching() {}

  onBufferAppending(data) {
    if (!this.segments) {
      this.segments = [data];
    } else {
      this.segments.push(data);
    }

    this.doAppending();
  }

  onMediaSourceClose() {
    console.log('media source closed');
  }

  onMediaSourceEnded() {
    console.log('media source ended');
  }

  onSBUpdateEnd(event) {
    this.appending = false;
    this.doAppending();
    this.updateMediaElementDuration();
  }

  updateMediaElementDuration() {}

  onMediaSourceOpen() {
    let mediaSource = this.mediaSource;

    if (mediaSource) {
      // once received, don't listen anymore to sourceopen event
      mediaSource.removeEventListener('sourceopen', this.onmso);
    }

    this.wfs.trigger(_events.default.MEDIA_ATTACHED, {
      media: this.media,
      channelName: this.channelName,
      mediaType: this.mediaType,
      websocketName: this.websocketName
    });
  }

  onBufferReset(data) {
    this.createSourceBuffers({
      tracks: 'video',
      mimeType: data.mimeType
    });
  }

  createSourceBuffers(tracks) {
    var sourceBuffer = this.sourceBuffer,
        mediaSource = this.mediaSource;
    let mimeType;

    if (tracks.mimeType === '') {
      mimeType = 'video/mp4;codecs=avc1.420028'; // avc1.42c01f avc1.42801e avc1.640028 avc1.420028
    } else {
      mimeType = 'video/mp4;codecs=' + tracks.mimeType;
    }

    try {
      let sb = sourceBuffer['video'] = mediaSource.addSourceBuffer(mimeType);
      sb.addEventListener('updateend', this.onsbue);
      track.buffer = sb;
    } catch (err) {}

    this.wfs.trigger(_events.default.BUFFER_CREATED, {
      tracks: tracks
    });
    this.media.play();
  }

  doAppending() {
    var wfs = this.wfs,
        sourceBuffer = this.sourceBuffer,
        segments = this.segments;

    if (Object.keys(sourceBuffer).length) {
      if (this.media.error) {
        this.segments = [];
        console.log('trying to append although a media error occured, flush segment and abort');
        return;
      }

      if (this.appending) {
        return;
      }

      if (segments && segments.length) {
        var segment = segments.shift();

        try {
          if (sourceBuffer[segment.type]) {
            this.parent = segment.parent;
            sourceBuffer[segment.type].appendBuffer(segment.data);
            this.appendError = 0;
            this.appended++;
            this.appending = true;
          } else {}
        } catch (err) {
          // in case any error occured while appending, put back segment in segments table 
          segments.unshift(segment);
          var event = {
            type: ErrorTypes.MEDIA_ERROR
          };

          if (err.code !== 22) {
            if (this.appendError) {
              this.appendError++;
            } else {
              this.appendError = 1;
            }

            event.details = ErrorDetails.BUFFER_APPEND_ERROR;
            event.frag = this.fragCurrent;

            if (this.appendError > wfs.config.appendErrorMaxRetry) {
              segments = [];
              event.fatal = true;
              return;
            } else {
              event.fatal = false;
            }
          } else {
            this.segments = [];
            event.details = ErrorDetails.BUFFER_FULL_ERROR;
            return;
          }
        }
      }
    }
  }

}

var _default = BufferController;
exports.default = _default;

},{"../event-handler":68,"../events":69,"core-js/modules/web.dom.iterable":61}],64:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _events = _interopRequireDefault(require("../events"));

var _eventHandler = _interopRequireDefault(require("../event-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Flow Controller
 */
class FlowController extends _eventHandler.default {
  constructor(wfs) {
    super(wfs, _events.default.MEDIA_ATTACHED, _events.default.BUFFER_CREATED, _events.default.FILE_PARSING_DATA, _events.default.FILE_HEAD_LOADED, _events.default.FILE_DATA_LOADED, _events.default.WEBSOCKET_ATTACHED, _events.default.FRAG_PARSING_DATA, _events.default.FRAG_PARSING_INIT_SEGMENT);
    this.fileStart = 0;
    this.fileEnd = 0;
    this.pendingAppending = 0;
    this.mediaType = undefined;

    channelName: this.channelName;
  }

  destroy() {
    _eventHandler.default.prototype.destroy.call(this);
  }

  onMediaAttached(data) {
    if (data.websocketName != undefined) {
      var client = new WebSocket('ws://' + this.wfs.ws_server);
      this.wfs.attachWebsocket(client, data.channelName);
    } else {
      console.log('websocketName ERROE!!!');
    }
  }

  onBufferCreated(data) {
    this.mediaType = data.mediaType;
  }

  onFileHeadLoaded(data) {}

  onFileDataLoaded(data) {}

  onFileParsingData(data) {}

  onWebsocketAttached(data) {
    this.wfs.trigger(_events.default.BUFFER_APPENDING, {
      type: 'video',
      data: data.payload,
      parent: 'main'
    });
  }

  onFragParsingInitSegment(data) {
    var tracks = data.tracks,
        trackName,
        track;
    track = tracks.video;

    if (track) {
      track.id = data.id;
    }

    for (trackName in tracks) {
      track = tracks[trackName];
      var initSegment = track.initSegment;

      if (initSegment) {
        this.pendingAppending++;
        this.wfs.trigger(_events.default.BUFFER_APPENDING, {
          type: trackName,
          data: initSegment,
          parent: 'main'
        });
      }
    }
  }

  onFragParsingData(data) {
    if (data.type === 'video') {}

    [data.data1, data.data2].forEach(buffer => {
      if (buffer) {
        this.pendingAppending++;
        this.wfs.trigger(_events.default.BUFFER_APPENDING, {
          type: data.type,
          data: buffer,
          parent: 'main'
        });
      }
    });
  }

}

var _default = FlowController;
exports.default = _default;

},{"../event-handler":68,"../events":69}],65:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _logger = _interopRequireDefault(require("../utils/logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Parser for exponential Golomb codes, a variable-bitwidth number encoding scheme used by h264.
 */
class ExpGolomb {
  constructor(data) {
    this.data = data; // the number of bytes left to examine in this.data

    this.bytesAvailable = this.data.byteLength; // the current word being examined

    this.word = 0; // :uint
    // the number of bits left to examine in the current word

    this.bitsAvailable = 0; // :uint
  } // ():void


  loadWord() {
    var position = this.data.byteLength - this.bytesAvailable,
        workingBytes = new Uint8Array(4),
        availableBytes = Math.min(4, this.bytesAvailable);

    if (availableBytes === 0) {
      throw new Error('no bytes available');
    }

    workingBytes.set(this.data.subarray(position, position + availableBytes));
    this.word = new DataView(workingBytes.buffer).getUint32(0); // track the amount of this.data that has been processed

    this.bitsAvailable = availableBytes * 8;
    this.bytesAvailable -= availableBytes;
  } // (count:int):void


  skipBits(count) {
    var skipBytes; // :int

    if (this.bitsAvailable > count) {
      this.word <<= count;
      this.bitsAvailable -= count;
    } else {
      count -= this.bitsAvailable;
      skipBytes = count >> 3;
      count -= skipBytes >> 3;
      this.bytesAvailable -= skipBytes;
      this.loadWord();
      this.word <<= count;
      this.bitsAvailable -= count;
    }
  } // (size:int):uint


  readBits(size) {
    var bits = Math.min(this.bitsAvailable, size),
        // :uint
    valu = this.word >>> 32 - bits; // :uint

    if (size > 32) {
      _logger.default.error('Cannot read more than 32 bits at a time');
    }

    this.bitsAvailable -= bits;

    if (this.bitsAvailable > 0) {
      this.word <<= bits;
    } else if (this.bytesAvailable > 0) {
      this.loadWord();
    }

    bits = size - bits;

    if (bits > 0) {
      return valu << bits | this.readBits(bits);
    } else {
      return valu;
    }
  } // ():uint


  skipLZ() {
    var leadingZeroCount; // :uint

    for (leadingZeroCount = 0; leadingZeroCount < this.bitsAvailable; ++leadingZeroCount) {
      if (0 !== (this.word & 0x80000000 >>> leadingZeroCount)) {
        // the first bit of working word is 1
        this.word <<= leadingZeroCount;
        this.bitsAvailable -= leadingZeroCount;
        return leadingZeroCount;
      }
    } // we exhausted word and still have not found a 1


    this.loadWord();
    return leadingZeroCount + this.skipLZ();
  } // ():void


  skipUEG() {
    this.skipBits(1 + this.skipLZ());
  } // ():void


  skipEG() {
    this.skipBits(1 + this.skipLZ());
  } // ():uint


  readUEG() {
    var clz = this.skipLZ(); // :uint

    return this.readBits(clz + 1) - 1;
  } // ():int


  readEG() {
    var valu = this.readUEG(); // :int

    if (0x01 & valu) {
      // the number is odd if the low order bit is set
      return 1 + valu >>> 1; // add 1 to make it even, and divide by 2
    } else {
      return -1 * (valu >>> 1); // divide by two then make it negative
    }
  } // Some convenience functions
  // :Boolean


  readBoolean() {
    return 1 === this.readBits(1);
  } // ():int


  readUByte() {
    return this.readBits(8);
  } // ():int


  readUShort() {
    return this.readBits(16);
  } // ():int


  readUInt() {
    return this.readBits(32);
  }
  /**
   * Advance the ExpGolomb decoder past a scaling list. The scaling
   * list is optionally transmitted as part of a sequence parameter
   * set and is not relevant to transmuxing.
   * @param count {number} the number of entries in this scaling list
   * @see Recommendation ITU-T H.264, Section 7.3.2.1.1.1
   */


  skipScalingList(count) {
    var lastScale = 8,
        nextScale = 8,
        j,
        deltaScale;

    for (j = 0; j < count; j++) {
      if (nextScale !== 0) {
        deltaScale = this.readEG();
        nextScale = (lastScale + deltaScale + 256) % 256;
      }

      lastScale = nextScale === 0 ? lastScale : nextScale;
    }
  }
  /**
   * Read a sequence parameter set and return some interesting video
   * properties. A sequence parameter set is the H264 metadata that
   * describes the properties of upcoming video frames.
   * @param data {Uint8Array} the bytes of a sequence parameter set
   * @return {object} an object with configuration parsed from the
   * sequence parameter set, including the dimensions of the
   * associated video frames.
   */


  readSPS() {
    var frameCropLeftOffset = 0,
        frameCropRightOffset = 0,
        frameCropTopOffset = 0,
        frameCropBottomOffset = 0,
        sarScale = 1,
        profileIdc,
        profileCompat,
        levelIdc,
        numRefFramesInPicOrderCntCycle,
        picWidthInMbsMinus1,
        picHeightInMapUnitsMinus1,
        frameMbsOnlyFlag,
        scalingListCount,
        i;
    this.readUByte();
    profileIdc = this.readUByte(); // profile_idc

    profileCompat = this.readBits(5); // constraint_set[0-4]_flag, u(5)

    this.skipBits(3); // reserved_zero_3bits u(3),

    levelIdc = this.readUByte(); //level_idc u(8)

    this.skipUEG(); // seq_parameter_set_id
    // some profiles have more optional data we don't need

    if (profileIdc === 100 || profileIdc === 110 || profileIdc === 122 || profileIdc === 244 || profileIdc === 44 || profileIdc === 83 || profileIdc === 86 || profileIdc === 118 || profileIdc === 128) {
      var chromaFormatIdc = this.readUEG();

      if (chromaFormatIdc === 3) {
        this.skipBits(1); // separate_colour_plane_flag
      }

      this.skipUEG(); // bit_depth_luma_minus8

      this.skipUEG(); // bit_depth_chroma_minus8

      this.skipBits(1); // qpprime_y_zero_transform_bypass_flag

      if (this.readBoolean()) {
        // seq_scaling_matrix_present_flag
        scalingListCount = chromaFormatIdc !== 3 ? 8 : 12;

        for (i = 0; i < scalingListCount; i++) {
          if (this.readBoolean()) {
            // seq_scaling_list_present_flag[ i ]
            if (i < 6) {
              this.skipScalingList(16);
            } else {
              this.skipScalingList(64);
            }
          }
        }
      }
    }

    this.skipUEG(); // log2_max_frame_num_minus4

    var picOrderCntType = this.readUEG();

    if (picOrderCntType === 0) {
      this.readUEG(); //log2_max_pic_order_cnt_lsb_minus4
    } else if (picOrderCntType === 1) {
      this.skipBits(1); // delta_pic_order_always_zero_flag

      this.skipEG(); // offset_for_non_ref_pic

      this.skipEG(); // offset_for_top_to_bottom_field

      numRefFramesInPicOrderCntCycle = this.readUEG();

      for (i = 0; i < numRefFramesInPicOrderCntCycle; i++) {
        this.skipEG(); // offset_for_ref_frame[ i ]
      }
    }

    this.skipUEG(); // max_num_ref_frames

    this.skipBits(1); // gaps_in_frame_num_value_allowed_flag

    picWidthInMbsMinus1 = this.readUEG();
    picHeightInMapUnitsMinus1 = this.readUEG();
    frameMbsOnlyFlag = this.readBits(1);

    if (frameMbsOnlyFlag === 0) {
      this.skipBits(1); // mb_adaptive_frame_field_flag
    }

    this.skipBits(1); // direct_8x8_inference_flag

    if (this.readBoolean()) {
      // frame_cropping_flag
      frameCropLeftOffset = this.readUEG();
      frameCropRightOffset = this.readUEG();
      frameCropTopOffset = this.readUEG();
      frameCropBottomOffset = this.readUEG();
    }

    if (this.readBoolean()) {
      // vui_parameters_present_flag
      if (this.readBoolean()) {
        // aspect_ratio_info_present_flag
        let sarRatio;
        const aspectRatioIdc = this.readUByte();

        switch (aspectRatioIdc) {
          case 1:
            sarRatio = [1, 1];
            break;

          case 2:
            sarRatio = [12, 11];
            break;

          case 3:
            sarRatio = [10, 11];
            break;

          case 4:
            sarRatio = [16, 11];
            break;

          case 5:
            sarRatio = [40, 33];
            break;

          case 6:
            sarRatio = [24, 11];
            break;

          case 7:
            sarRatio = [20, 11];
            break;

          case 8:
            sarRatio = [32, 11];
            break;

          case 9:
            sarRatio = [80, 33];
            break;

          case 10:
            sarRatio = [18, 11];
            break;

          case 11:
            sarRatio = [15, 11];
            break;

          case 12:
            sarRatio = [64, 33];
            break;

          case 13:
            sarRatio = [160, 99];
            break;

          case 14:
            sarRatio = [4, 3];
            break;

          case 15:
            sarRatio = [3, 2];
            break;

          case 16:
            sarRatio = [2, 1];
            break;

          case 255:
            {
              sarRatio = [this.readUByte() << 8 | this.readUByte(), this.readUByte() << 8 | this.readUByte()];
              break;
            }
        }

        if (sarRatio) {
          sarScale = sarRatio[0] / sarRatio[1];
        }
      }
    }

    return {
      width: Math.ceil(((picWidthInMbsMinus1 + 1) * 16 - frameCropLeftOffset * 2 - frameCropRightOffset * 2) * sarScale),
      height: (2 - frameMbsOnlyFlag) * (picHeightInMapUnitsMinus1 + 1) * 16 - (frameMbsOnlyFlag ? 2 : 4) * (frameCropTopOffset + frameCropBottomOffset)
    };
  }

  readSliceType() {
    // skip NALu type
    this.readUByte(); // discard first_mb_in_slice

    this.readUEG(); // return slice_type

    return this.readUEG();
  }

}

var _default = ExpGolomb;
exports.default = _default;

},{"../utils/logger":76}],66:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.regexp.to-string");

var _events = _interopRequireDefault(require("../events"));

var _expGolomb = _interopRequireDefault(require("./exp-golomb"));

var _eventHandler = _interopRequireDefault(require("../event-handler"));

var _mp4Remuxer = _interopRequireDefault(require("../remux/mp4-remuxer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**

*/
class h264Demuxer extends _eventHandler.default {
  constructor(wfs) {
    let config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    super(wfs, _events.default.H264_DATA_PARSED);
    this.config = this.wfs.config || config;
    this.wfs = wfs;
    this.id = 'main';
    this.remuxer = new _mp4Remuxer.default(this.wfs, this.id, this.config);
    this.contiguous = true;
    this.timeOffset = 1;
    this.sn = 0;
    this.TIMESCALE = 90000;
    this.timestamp = 0;
    this.scaleFactor = this.TIMESCALE / 1000;
    this.H264_TIMEBASE = 3600;
    this._avcTrack = {
      container: 'video/mp4',
      type: 'video',
      id: 1,
      sequenceNumber: 0,
      samples: [],
      len: 0,
      nbNalu: 0,
      dropped: 0,
      count: 0
    };
    this.browserType = 0;

    if (navigator.userAgent.toLowerCase().indexOf('firefox') !== -1) {
      this.browserType = 1;
    }
  }

  destroy() {
    _eventHandler.default.prototype.destroy.call(this);
  }

  getTimestampM() {
    this.timestamp += this.H264_TIMEBASE;
    return this.timestamp;
  }

  onH264DataParsed(event) {
    this._parseAVCTrack(event.data);

    this.remuxer.pushVideo(0, this.sn, this._avcTrack, this.timeOffset, this.contiguous);
    this.sn += 1;
  }

  _parseAVCTrack(array) {
    var track = this._avcTrack,
        samples = track.samples,
        units = this._parseAVCNALu(array),
        units2 = [],
        debug = false,
        key = false,
        length = 0,
        expGolombDecoder,
        avcSample,
        push,
        i;

    var debugString = '';

    var pushAccesUnit = function () {
      if (units2.length) {
        if (!this.config.forceKeyFrameOnDiscontinuity || key === true || track.sps && (samples.length || this.contiguous)) {
          var tss = this.getTimestampM();
          avcSample = {
            units: {
              units: units2,
              length: length
            },
            pts: tss,
            dts: tss,
            key: key
          };
          samples.push(avcSample);
          track.len += length;
          track.nbNalu += units2.length;
        } else {
          track.dropped++;
        }

        units2 = [];
        length = 0;
      }
    }.bind(this);

    units.forEach(unit => {
      switch (unit.type) {
        //NDR
        case 1:
          push = true;

          if (debug) {
            debugString += 'NDR ';
          }

          break;
        //IDR

        case 5:
          push = true;

          if (debug) {
            debugString += 'IDR ';
          }

          key = true;
          break;
        //SEI

        case 6:
          unit.data = this.discardEPB(unit.data);
          expGolombDecoder = new _expGolomb.default(unit.data); // skip frameType

          expGolombDecoder.readUByte();
          break;
        //SPS

        case 7:
          push = false;

          if (debug) {
            debugString += 'SPS ';
          }

          if (!track.sps) {
            expGolombDecoder = new _expGolomb.default(unit.data);
            var config = expGolombDecoder.readSPS();
            track.width = config.width;
            track.height = config.height;
            track.sps = [unit.data];
            track.duration = 0;
            var codecarray = unit.data.subarray(1, 4);
            var codecstring = 'avc1.';

            for (i = 0; i < 3; i++) {
              var h = codecarray[i].toString(16);

              if (h.length < 2) {
                h = '0' + h;
              }

              codecstring += h;
            }

            track.codec = codecstring;
            this.wfs.trigger(_events.default.BUFFER_RESET, {
              mimeType: track.codec
            });
            push = true;
          }

          break;
        //PPS

        case 8:
          push = false;

          if (debug) {
            debugString += 'PPS ';
          }

          if (!track.pps) {
            track.pps = [unit.data];
            push = true;
          }

          break;

        case 9:
          push = false;

          if (debug) {
            debugString += 'AUD ';
          }

          pushAccesUnit();
          break;

        default:
          push = false;
          debugString += 'unknown NAL ' + unit.type + ' ';
          break;
      }

      if (push) {
        units2.push(unit);
        length += unit.data.byteLength;
      }
    });

    if (debug || debugString.length) {
      logger.log(debugString);
    }

    pushAccesUnit();
  }

  _parseAVCNALu(array) {
    var i = 0,
        len = array.byteLength,
        value,
        overflow,
        state = 0; //state = this.avcNaluState;

    var units = [],
        unit,
        unitType,
        lastUnitStart,
        lastUnitType;

    while (i < len) {
      value = array[i++]; // finding 3 or 4-byte start codes (00 00 01 OR 00 00 00 01)

      switch (state) {
        case 0:
          if (value === 0) {
            state = 1;
          }

          break;

        case 1:
          if (value === 0) {
            state = 2;
          } else {
            state = 0;
          }

          break;

        case 2:
        case 3:
          if (value === 0) {
            state = 3;
          } else if (value === 1 && i < len) {
            unitType = array[i] & 0x1f;

            if (lastUnitStart) {
              unit = {
                data: array.subarray(lastUnitStart, i - state - 1),
                type: lastUnitType
              };
              units.push(unit);
            } else {}

            lastUnitStart = i;
            lastUnitType = unitType;
            state = 0;
          } else {
            state = 0;
          }

          break;

        default:
          break;
      }
    }

    if (lastUnitStart) {
      unit = {
        data: array.subarray(lastUnitStart, len),
        type: lastUnitType,
        state: state
      };
      units.push(unit);
    }

    return units;
  }
  /**
   * remove Emulation Prevention bytes from a RBSP
   */


  discardEPB(data) {
    var length = data.byteLength,
        EPBPositions = [],
        i = 1,
        newLength,
        newData; // Find all `Emulation Prevention Bytes`

    while (i < length - 2) {
      if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0x03) {
        EPBPositions.push(i + 2);
        i += 2;
      } else {
        i++;
      }
    } // If no Emulation Prevention Bytes were found just return the original
    // array


    if (EPBPositions.length === 0) {
      return data;
    } // Create a new array to hold the NAL unit data


    newLength = length - EPBPositions.length;
    newData = new Uint8Array(newLength);
    var sourceIndex = 0;

    for (i = 0; i < newLength; sourceIndex++, i++) {
      if (sourceIndex === EPBPositions[0]) {
        // Skip this byte
        sourceIndex++; // Remove this position index

        EPBPositions.shift();
      }

      newData[i] = data[sourceIndex];
    }

    return newData;
  }

}

var _default = h264Demuxer;
exports.default = _default;

},{"../event-handler":68,"../events":69,"../remux/mp4-remuxer":74,"./exp-golomb":65,"core-js/modules/es6.regexp.to-string":60}],67:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorDetails = exports.ErrorTypes = void 0;
const ErrorTypes = {
  // Identifier for a network error (loading error / timeout ...)
  NETWORK_ERROR: 'networkError',
  // Identifier for a media Error (video/parsing/mediasource error)
  MEDIA_ERROR: 'mediaError',
  // Identifier for all other errors
  OTHER_ERROR: 'otherError'
};
exports.ErrorTypes = ErrorTypes;
const ErrorDetails = {
  // Identifier for a manifest load error - data: { url : faulty URL, response : { code: error code, text: error text }}
  MANIFEST_LOAD_ERROR: 'manifestLoadError',
  // Identifier for a manifest load timeout - data: { url : faulty URL, response : { code: error code, text: error text }}
  MANIFEST_LOAD_TIMEOUT: 'manifestLoadTimeOut',
  // Identifier for a manifest parsing error - data: { url : faulty URL, reason : error reason}
  MANIFEST_PARSING_ERROR: 'manifestParsingError',
  // Identifier for a manifest with only incompatible codecs error - data: { url : faulty URL, reason : error reason}
  MANIFEST_INCOMPATIBLE_CODECS_ERROR: 'manifestIncompatibleCodecsError',
  // Identifier for a level load error - data: { url : faulty URL, response : { code: error code, text: error text }}
  LEVEL_LOAD_ERROR: 'levelLoadError',
  // Identifier for a level load timeout - data: { url : faulty URL, response : { code: error code, text: error text }}
  LEVEL_LOAD_TIMEOUT: 'levelLoadTimeOut',
  // Identifier for a level switch error - data: { level : faulty level Id, event : error description}
  LEVEL_SWITCH_ERROR: 'levelSwitchError',
  // Identifier for an audio track load error - data: { url : faulty URL, response : { code: error code, text: error text }}
  AUDIO_TRACK_LOAD_ERROR: 'audioTrackLoadError',
  // Identifier for an audio track load timeout - data: { url : faulty URL, response : { code: error code, text: error text }}
  AUDIO_TRACK_LOAD_TIMEOUT: 'audioTrackLoadTimeOut',
  // Identifier for fragment load error - data: { frag : fragment object, response : { code: error code, text: error text }}
  FRAG_LOAD_ERROR: 'fragLoadError',
  // Identifier for fragment loop loading error - data: { frag : fragment object}
  FRAG_LOOP_LOADING_ERROR: 'fragLoopLoadingError',
  // Identifier for fragment load timeout error - data: { frag : fragment object}
  FRAG_LOAD_TIMEOUT: 'fragLoadTimeOut',
  // Identifier for a fragment decryption error event - data: parsing error description
  FRAG_DECRYPT_ERROR: 'fragDecryptError',
  // Identifier for a fragment parsing error event - data: parsing error description
  FRAG_PARSING_ERROR: 'fragParsingError',
  // Identifier for decrypt key load error - data: { frag : fragment object, response : { code: error code, text: error text }}
  KEY_LOAD_ERROR: 'keyLoadError',
  // Identifier for decrypt key load timeout error - data: { frag : fragment object}
  KEY_LOAD_TIMEOUT: 'keyLoadTimeOut',
  // Triggered when an exception occurs while adding a sourceBuffer to MediaSource - data : {  err : exception , mimeType : mimeType }
  BUFFER_ADD_CODEC_ERROR: 'bufferAddCodecError',
  // Identifier for a buffer append error - data: append error description
  BUFFER_APPEND_ERROR: 'bufferAppendError',
  // Identifier for a buffer appending error event - data: appending error description
  BUFFER_APPENDING_ERROR: 'bufferAppendingError',
  // Identifier for a buffer stalled error event
  BUFFER_STALLED_ERROR: 'bufferStalledError',
  // Identifier for a buffer full event
  BUFFER_FULL_ERROR: 'bufferFullError',
  // Identifier for a buffer seek over hole event
  BUFFER_SEEK_OVER_HOLE: 'bufferSeekOverHole',
  // Identifier for an internal exception happening inside hls.js while handling an event
  INTERNAL_EXCEPTION: 'internalException'
};
exports.ErrorDetails = ErrorDetails;

},{}],68:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.regexp.replace");

/*
 *
 * All objects in the event handling chain should inherit from this class
 *
 */
class EventHandler {
  constructor(wfs) {
    this.wfs = wfs;
    this.onEvent = this.onEvent.bind(this);

    for (var _len = arguments.length, events = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      events[_key - 1] = arguments[_key];
    }

    this.handledEvents = events;
    this.useGenericHandler = true;
    this.registerListeners();
  }

  destroy() {
    this.unregisterListeners();
  }

  isEventHandler() {
    return typeof this.handledEvents === 'object' && this.handledEvents.length && typeof this.onEvent === 'function';
  }

  registerListeners() {
    if (this.isEventHandler()) {
      this.handledEvents.forEach(function (event) {
        if (event === 'wfsEventGeneric') {//throw new Error('Forbidden event name: ' + event);
        }

        this.wfs.on(event, this.onEvent);
      }.bind(this));
    }
  }

  unregisterListeners() {
    if (this.isEventHandler()) {
      this.handledEvents.forEach(function (event) {
        this.wfs.off(event, this.onEvent);
      }.bind(this));
    }
  }
  /**
   * arguments: event (string), data (any)
   */


  onEvent(event, data) {
    this.onEventGeneric(event, data);
  }

  onEventGeneric(event, data) {
    var eventToFunction = function eventToFunction(event, data) {
      var funcName = 'on' + event.replace('wfs', '');

      if (typeof this[funcName] !== 'function') {//throw new Error(`Event ${event} has no generic handler in this ${this.constructor.name} class (tried ${funcName})`);
      }

      return this[funcName].bind(this, data);
    };

    try {
      eventToFunction.call(this, event, data).call();
    } catch (err) {
      console.log("internal error happened while processing ".concat(event, ":").concat(err.message)); //   this.hls.trigger(Event.ERROR, {type: ErrorTypes.OTHER_ERROR, details: ErrorDetails.INTERNAL_EXCEPTION, fatal: false, event : event, err : err});
    }
  }

}

var _default = EventHandler;
exports.default = _default;

},{"core-js/modules/es6.regexp.replace":59}],69:[function(require,module,exports){
"use strict";

module.exports = {
  MEDIA_ATTACHING: 'wfsMediaAttaching',
  MEDIA_ATTACHED: 'wfsMediaAttached',
  FRAG_LOADING: 'wfsFragLoading',
  BUFFER_CREATED: 'wfsBufferCreated',
  BUFFER_APPENDING: 'wfsBufferAppending',
  BUFFER_RESET: 'wfsBufferReset',
  FRAG_PARSING_DATA: 'wfsFragParsingData',
  FRAG_PARSING_INIT_SEGMENT: 'wfsFragParsingInitSegment',
  //------------------------------------------
  H264_DATA_PARSING: 'wfsH264DataParsing',
  H264_DATA_PARSED: 'wfsH264DataParsed',
  //------------------------------------------
  WEBSOCKET_ATTACHED: 'wfsWebsocketAttached',
  WEBSOCKET_ATTACHING: 'wfsWebsocketAttaching',
  WEBSOCKET_DATA_UPLOADING: 'wfsWebsocketDataUploading',
  WEBSOCKET_MESSAGE_SENDING: 'wfsWebsocketMessageSending'
};

},{}],70:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 *  AAC helper
 */
class AAC {
  static getSilentFrame(channelCount) {
    if (channelCount === 1) {
      return new Uint8Array([0x00, 0xc8, 0x00, 0x80, 0x23, 0x80]);
    } else if (channelCount === 2) {
      return new Uint8Array([0x21, 0x00, 0x49, 0x90, 0x02, 0x19, 0x00, 0x23, 0x80]);
    } else if (channelCount === 3) {
      return new Uint8Array([0x00, 0xc8, 0x00, 0x80, 0x20, 0x84, 0x01, 0x26, 0x40, 0x08, 0x64, 0x00, 0x8e]);
    } else if (channelCount === 4) {
      return new Uint8Array([0x00, 0xc8, 0x00, 0x80, 0x20, 0x84, 0x01, 0x26, 0x40, 0x08, 0x64, 0x00, 0x80, 0x2c, 0x80, 0x08, 0x02, 0x38]);
    } else if (channelCount === 5) {
      return new Uint8Array([0x00, 0xc8, 0x00, 0x80, 0x20, 0x84, 0x01, 0x26, 0x40, 0x08, 0x64, 0x00, 0x82, 0x30, 0x04, 0x99, 0x00, 0x21, 0x90, 0x02, 0x38]);
    } else if (channelCount === 6) {
      return new Uint8Array([0x00, 0xc8, 0x00, 0x80, 0x20, 0x84, 0x01, 0x26, 0x40, 0x08, 0x64, 0x00, 0x82, 0x30, 0x04, 0x99, 0x00, 0x21, 0x90, 0x02, 0x00, 0xb2, 0x00, 0x20, 0x08, 0xe0]);
    }

    return null;
  }

}

var _default = AAC;
exports.default = _default;

},{}],71:[function(require,module,exports){
"use strict";

// This is mostly for support of the es6 module export
// syntax with the babel compiler, it looks like it doesnt support
// function exports like we are used to in node/commonjs
module.exports = require('./wfs.js').default;

},{"./wfs.js":77}],72:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _events = _interopRequireDefault(require("../events"));

var _eventHandler = _interopRequireDefault(require("../event-handler"));

var _h264NalSlicesreader = _interopRequireDefault(require("../utils/h264-nal-slicesreader.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Websocket Loader
 */
class WebsocketLoader extends _eventHandler.default {
  constructor(wfs) {
    super(wfs, _events.default.WEBSOCKET_ATTACHING, _events.default.WEBSOCKET_DATA_UPLOADING, _events.default.WEBSOCKET_MESSAGE_SENDING);
    this.buf = null;
    this.slicesReader = new _h264NalSlicesreader.default(wfs);
    this.mediaType = undefined;
    this.channelName = undefined;
  }

  destroy() {
    !!this.client && this.client.close();
    this.slicesReader.destroy();

    _eventHandler.default.prototype.destroy.call(this);
  }

  onWebsocketAttaching(data) {
    this.mediaType = data.mediaType;
    this.channelName = data.channelName;

    if (data.websocket instanceof WebSocket) {
      this.client = data.websocket;
      this.client.onopen = this.initSocketClient.bind(this);

      this.client.onclose = function (e) {
        console.log('Websocket Disconnected!');
      };
    }
  }

  initSocketClient(client) {
    this.client.binaryType = 'arraybuffer';
    this.client.onmessage = this.receiveSocketMessage.bind(this);
    this.wfs.trigger(_events.default.WEBSOCKET_MESSAGE_SENDING, {
      commandType: "open",
      channelName: this.channelName,
      commandValue: "NA"
    });
    console.log('Websocket Open!');
  }

  receiveSocketMessage(event) {
    this.buf = new Uint8Array(event.data);
    var copy = new Uint8Array(this.buf);
    this.wfs.trigger(_events.default.H264_DATA_PARSING, {
      data: copy
    });
  }

  onWebsocketDataUploading(event) {
    this.client.send(event.data);
  }

  onWebsocketMessageSending(event) {
    this.client.send(JSON.stringify({
      t: event.commandType,
      c: event.channelName,
      v: event.commandValue
    }));
  }

}

var _default = WebsocketLoader;
exports.default = _default;

},{"../event-handler":68,"../events":69,"../utils/h264-nal-slicesreader.js":75}],73:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.regexp.flags");

/**
 * Generate MP4 Box
 */
//import Hex from '../utils/hex';
class MP4 {
  static init() {
    MP4.types = {
      avc1: [],
      // codingname
      avcC: [],
      btrt: [],
      dinf: [],
      dref: [],
      esds: [],
      ftyp: [],
      hdlr: [],
      mdat: [],
      mdhd: [],
      mdia: [],
      mfhd: [],
      minf: [],
      moof: [],
      moov: [],
      mp4a: [],
      mvex: [],
      mvhd: [],
      sdtp: [],
      stbl: [],
      stco: [],
      stsc: [],
      stsd: [],
      stsz: [],
      stts: [],
      tfdt: [],
      tfhd: [],
      traf: [],
      trak: [],
      trun: [],
      trex: [],
      tkhd: [],
      vmhd: [],
      smhd: []
    };
    var i;

    for (i in MP4.types) {
      if (MP4.types.hasOwnProperty(i)) {
        MP4.types[i] = [i.charCodeAt(0), i.charCodeAt(1), i.charCodeAt(2), i.charCodeAt(3)];
      }
    }

    var videoHdlr = new Uint8Array([0x00, // version 0
    0x00, 0x00, 0x00, // flags
    0x00, 0x00, 0x00, 0x00, // pre_defined
    0x76, 0x69, 0x64, 0x65, // handler_type: 'vide'
    0x00, 0x00, 0x00, 0x00, // reserved
    0x00, 0x00, 0x00, 0x00, // reserved
    0x00, 0x00, 0x00, 0x00, // reserved
    0x56, 0x69, 0x64, 0x65, 0x6f, 0x48, 0x61, 0x6e, 0x64, 0x6c, 0x65, 0x72, 0x00 // name: 'VideoHandler'
    ]);
    var audioHdlr = new Uint8Array([0x00, // version 0
    0x00, 0x00, 0x00, // flags
    0x00, 0x00, 0x00, 0x00, // pre_defined
    0x73, 0x6f, 0x75, 0x6e, // handler_type: 'soun'
    0x00, 0x00, 0x00, 0x00, // reserved
    0x00, 0x00, 0x00, 0x00, // reserved
    0x00, 0x00, 0x00, 0x00, // reserved
    0x53, 0x6f, 0x75, 0x6e, 0x64, 0x48, 0x61, 0x6e, 0x64, 0x6c, 0x65, 0x72, 0x00 // name: 'SoundHandler'
    ]);
    MP4.HDLR_TYPES = {
      'video': videoHdlr,
      'audio': audioHdlr
    };
    var dref = new Uint8Array([0x00, // version 0
    0x00, 0x00, 0x00, // flags
    0x00, 0x00, 0x00, 0x01, // entry_count
    0x00, 0x00, 0x00, 0x0c, // entry_size
    0x75, 0x72, 0x6c, 0x20, // 'url' type
    0x00, // version 0
    0x00, 0x00, 0x01 // entry_flags
    ]);
    var stco = new Uint8Array([0x00, // version
    0x00, 0x00, 0x00, // flags
    0x00, 0x00, 0x00, 0x00 // entry_count
    ]);
    MP4.STTS = MP4.STSC = MP4.STCO = stco;
    MP4.STSZ = new Uint8Array([0x00, // version
    0x00, 0x00, 0x00, // flags
    0x00, 0x00, 0x00, 0x00, // sample_size
    0x00, 0x00, 0x00, 0x00 // sample_count
    ]);
    MP4.VMHD = new Uint8Array([0x00, // version
    0x00, 0x00, 0x01, // flags
    0x00, 0x00, // graphicsmode
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00 // opcolor
    ]);
    MP4.SMHD = new Uint8Array([0x00, // version
    0x00, 0x00, 0x00, // flags
    0x00, 0x00, // balance
    0x00, 0x00 // reserved
    ]);
    MP4.STSD = new Uint8Array([0x00, // version 0
    0x00, 0x00, 0x00, // flags
    0x00, 0x00, 0x00, 0x01]); // entry_count

    var majorBrand = new Uint8Array([105, 115, 111, 109]); // isom

    var avc1Brand = new Uint8Array([97, 118, 99, 49]); // avc1

    var minorVersion = new Uint8Array([0, 0, 0, 1]);
    MP4.FTYP = MP4.box(MP4.types.ftyp, majorBrand, minorVersion, majorBrand, avc1Brand);
    MP4.DINF = MP4.box(MP4.types.dinf, MP4.box(MP4.types.dref, dref));
  }

  static box(type) {
    var payload = Array.prototype.slice.call(arguments, 1),
        size = 8,
        i = payload.length,
        len = i,
        result; // calculate the total size we need to allocate

    while (i--) {
      size += payload[i].byteLength;
    }

    result = new Uint8Array(size);
    result[0] = size >> 24 & 0xff;
    result[1] = size >> 16 & 0xff;
    result[2] = size >> 8 & 0xff;
    result[3] = size & 0xff;
    result.set(type, 4); // copy the payload into the result

    for (i = 0, size = 8; i < len; i++) {
      // copy payload[i] array @ offset size
      result.set(payload[i], size);
      size += payload[i].byteLength;
    }

    return result;
  }

  static hdlr(type) {
    return MP4.box(MP4.types.hdlr, MP4.HDLR_TYPES[type]);
  }

  static mdat(data) {
    //  console.log( "mdat==> ",data.length );
    return MP4.box(MP4.types.mdat, data);
  }

  static mdhd(timescale, duration) {
    duration *= timescale;
    return MP4.box(MP4.types.mdhd, new Uint8Array([0x00, // version 0
    0x00, 0x00, 0x00, // flags
    0x00, 0x00, 0x00, 0x02, // creation_time
    0x00, 0x00, 0x00, 0x03, // modification_time
    timescale >> 24 & 0xFF, timescale >> 16 & 0xFF, timescale >> 8 & 0xFF, timescale & 0xFF, // timescale
    duration >> 24, duration >> 16 & 0xFF, duration >> 8 & 0xFF, duration & 0xFF, // duration
    0x55, 0xc4, // 'und' language (undetermined)
    0x00, 0x00]));
  }

  static mdia(track) {
    return MP4.box(MP4.types.mdia, MP4.mdhd(track.timescale, track.duration), MP4.hdlr(track.type), MP4.minf(track));
  }

  static mfhd(sequenceNumber) {
    return MP4.box(MP4.types.mfhd, new Uint8Array([0x00, 0x00, 0x00, 0x00, // flags
    sequenceNumber >> 24, sequenceNumber >> 16 & 0xFF, sequenceNumber >> 8 & 0xFF, sequenceNumber & 0xFF // sequence_number
    ]));
  }

  static minf(track) {
    if (track.type === 'audio') {
      return MP4.box(MP4.types.minf, MP4.box(MP4.types.smhd, MP4.SMHD), MP4.DINF, MP4.stbl(track));
    } else {
      return MP4.box(MP4.types.minf, MP4.box(MP4.types.vmhd, MP4.VMHD), MP4.DINF, MP4.stbl(track));
    }
  }

  static moof(sn, baseMediaDecodeTime, track) {
    return MP4.box(MP4.types.moof, MP4.mfhd(sn), MP4.traf(track, baseMediaDecodeTime));
  }
  /**
   * @param tracks... (optional) {array} the tracks associated with this movie
   */


  static moov(tracks) {
    var i = tracks.length,
        boxes = [];

    while (i--) {
      boxes[i] = MP4.trak(tracks[i]);
    }

    return MP4.box.apply(null, [MP4.types.moov, MP4.mvhd(tracks[0].timescale, tracks[0].duration)].concat(boxes).concat(MP4.mvex(tracks)));
  }

  static mvex(tracks) {
    var i = tracks.length,
        boxes = [];

    while (i--) {
      boxes[i] = MP4.trex(tracks[i]);
    }

    return MP4.box.apply(null, [MP4.types.mvex].concat(boxes));
  }

  static mvhd(timescale, duration) {
    duration = 0;
    var bytes = new Uint8Array([0x00, // version 0
    0x00, 0x00, 0x00, // flags
    0x00, 0x00, 0x00, 0x01, // creation_time
    0x00, 0x00, 0x00, 0x02, // modification_time
    timescale >> 24 & 0xFF, timescale >> 16 & 0xFF, timescale >> 8 & 0xFF, timescale & 0xFF, // timescale
    duration >> 24 & 0xFF, duration >> 16 & 0xFF, duration >> 8 & 0xFF, duration & 0xFF, // duration
    0x00, 0x01, 0x00, 0x00, // 1.0 rate
    0x01, 0x00, // 1.0 volume
    0x00, 0x00, // reserved
    0x00, 0x00, 0x00, 0x00, // reserved
    0x00, 0x00, 0x00, 0x00, // reserved
    0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0x00, 0x00, 0x00, // transformation: unity matrix
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // pre_defined
    0xff, 0xff, 0xff, 0xff // next_track_ID
    ]);
    return MP4.box(MP4.types.mvhd, bytes);
  }

  static sdtp(track) {
    var samples = track.samples || [],
        bytes = new Uint8Array(4 + samples.length),
        flags,
        i; // leave the full box header (4 bytes) all zero
    // write the sample table

    for (i = 0; i < samples.length; i++) {
      flags = samples[i].flags;
      bytes[i + 4] = flags.dependsOn << 4 | flags.isDependedOn << 2 | flags.hasRedundancy;
    }

    return MP4.box(MP4.types.sdtp, bytes);
  }

  static stbl(track) {
    return MP4.box(MP4.types.stbl, MP4.stsd(track), MP4.box(MP4.types.stts, MP4.STTS), MP4.box(MP4.types.stsc, MP4.STSC), MP4.box(MP4.types.stsz, MP4.STSZ), MP4.box(MP4.types.stco, MP4.STCO));
  }

  static avc1(track) {
    var sps = [],
        pps = [],
        i,
        data,
        len; // assemble the SPSs

    for (i = 0; i < track.sps.length; i++) {
      data = track.sps[i];
      len = data.byteLength;
      sps.push(len >>> 8 & 0xFF);
      sps.push(len & 0xFF);
      sps = sps.concat(Array.prototype.slice.call(data)); // SPS
    } // assemble the PPSs


    for (i = 0; i < track.pps.length; i++) {
      data = track.pps[i];
      len = data.byteLength;
      pps.push(len >>> 8 & 0xFF);
      pps.push(len & 0xFF);
      pps = pps.concat(Array.prototype.slice.call(data));
    }

    var avcc = MP4.box(MP4.types.avcC, new Uint8Array([0x01, // version
    sps[3], // profile
    sps[4], // profile compat
    sps[5], // level
    0xfc | 3, // lengthSizeMinusOne, hard-coded to 4 bytes
    0xE0 | track.sps.length // 3bit reserved (111) + numOfSequenceParameterSets
    ].concat(sps).concat([track.pps.length // numOfPictureParameterSets
    ]).concat(pps))),
        // "PPS"
    width = track.width,
        height = track.height; //console.log('avcc:' + Hex.hexDump(avcc));

    return MP4.box(MP4.types.avc1, new Uint8Array([0x00, 0x00, 0x00, // reserved
    0x00, 0x00, 0x00, // reserved
    0x00, 0x01, // data_reference_index
    0x00, 0x00, // pre_defined
    0x00, 0x00, // reserved
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // pre_defined
    width >> 8 & 0xFF, width & 0xff, // width
    height >> 8 & 0xFF, height & 0xff, // height
    0x00, 0x48, 0x00, 0x00, // horizresolution
    0x00, 0x48, 0x00, 0x00, // vertresolution
    0x00, 0x00, 0x00, 0x00, // reserved
    0x00, 0x01, // frame_count
    0x12, 0x6a, 0x65, 0x66, 0x66, // wfs.js
    0x2d, 0x79, 0x61, 0x6e, 0x2f, 0x2f, 0x2f, 0x67, 0x77, 0x66, 0x73, 0x2E, 0x6A, 0x73, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // compressorname
    0x00, 0x18, // depth = 24
    0x11, 0x11]), // pre_defined = -1
    avcc, MP4.box(MP4.types.btrt, new Uint8Array([0x00, 0x1c, 0x9c, 0x80, // bufferSizeDB
    0x00, 0x2d, 0xc6, 0xc0, // maxBitrate
    0x00, 0x2d, 0xc6, 0xc0])) // avgBitrate
    );
  }

  static esds(track) {
    var configlen = track.config.length;
    return new Uint8Array([0x00, // version 0
    0x00, 0x00, 0x00, // flags
    0x03, // descriptor_type
    0x17 + configlen, // length
    0x00, 0x01, //es_id
    0x00, // stream_priority
    0x04, // descriptor_type
    0x0f + configlen, // length
    0x40, //codec : mpeg4_audio
    0x15, // stream_type
    0x00, 0x00, 0x00, // buffer_size
    0x00, 0x00, 0x00, 0x00, // maxBitrate
    0x00, 0x00, 0x00, 0x00, // avgBitrate
    0x05 // descriptor_type
    ].concat([configlen]).concat(track.config).concat([0x06, 0x01, 0x02])); // GASpecificConfig)); // length + audio config descriptor
  }

  static mp4a(track) {
    var audiosamplerate = track.audiosamplerate;
    return MP4.box(MP4.types.mp4a, new Uint8Array([0x00, 0x00, 0x00, // reserved
    0x00, 0x00, 0x00, // reserved
    0x00, 0x01, // data_reference_index
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // reserved
    0x00, track.channelCount, // channelcount
    0x00, 0x10, // sampleSize:16bits
    0x00, 0x00, 0x00, 0x00, // reserved2
    audiosamplerate >> 8 & 0xFF, audiosamplerate & 0xff, //
    0x00, 0x00]), MP4.box(MP4.types.esds, MP4.esds(track)));
  }

  static stsd(track) {
    if (track.type === 'audio') {
      return MP4.box(MP4.types.stsd, MP4.STSD, MP4.mp4a(track));
    } else {
      return MP4.box(MP4.types.stsd, MP4.STSD, MP4.avc1(track));
    }
  }

  static tkhd(track) {
    var id = track.id,
        duration = track.duration * track.timescale,
        width = track.width,
        height = track.height; //   console.log( "tkhd==> ",track.id, track.duration, track.timescale, width,height );

    return MP4.box(MP4.types.tkhd, new Uint8Array([0x00, // version 0
    0x00, 0x00, 0x07, // flags
    0x00, 0x00, 0x00, 0x00, // creation_time
    0x00, 0x00, 0x00, 0x00, // modification_time
    id >> 24 & 0xFF, id >> 16 & 0xFF, id >> 8 & 0xFF, id & 0xFF, // track_ID
    0x00, 0x00, 0x00, 0x00, // reserved
    duration >> 24, duration >> 16 & 0xFF, duration >> 8 & 0xFF, duration & 0xFF, // duration
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // reserved
    0x00, 0x00, // layer
    0x00, 0x00, // alternate_group
    0x00, 0x00, // non-audio track volume
    0x00, 0x00, // reserved
    0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0x00, 0x00, 0x00, // transformation: unity matrix
    width >> 8 & 0xFF, width & 0xFF, 0x00, 0x00, // width
    height >> 8 & 0xFF, height & 0xFF, 0x00, 0x00 // height
    ]));
  }

  static traf(track, baseMediaDecodeTime) {
    var sampleDependencyTable = MP4.sdtp(track),
        id = track.id; //  console.log( "traf==> ",id ,baseMediaDecodeTime);

    return MP4.box(MP4.types.traf, MP4.box(MP4.types.tfhd, new Uint8Array([0x00, // version 0
    0x00, 0x00, 0x00, // flags
    id >> 24, id >> 16 & 0XFF, id >> 8 & 0XFF, id & 0xFF // track_ID
    ])), MP4.box(MP4.types.tfdt, new Uint8Array([0x00, // version 0
    0x00, 0x00, 0x00, // flags
    baseMediaDecodeTime >> 24, baseMediaDecodeTime >> 16 & 0XFF, baseMediaDecodeTime >> 8 & 0XFF, baseMediaDecodeTime & 0xFF // baseMediaDecodeTime
    ])), MP4.trun(track, sampleDependencyTable.length + 16 + // tfhd
    16 + // tfdt
    8 + // traf header
    16 + // mfhd
    8 + // moof header
    8), // mdat header
    sampleDependencyTable);
  }
  /**
   * Generate a track box.
   * @param track {object} a track definition
   * @return {Uint8Array} the track box
   */


  static trak(track) {
    track.duration = track.duration || 0xffffffff;
    return MP4.box(MP4.types.trak, MP4.tkhd(track), MP4.mdia(track));
  }

  static trex(track) {
    var id = track.id;
    return MP4.box(MP4.types.trex, new Uint8Array([0x00, // version 0
    0x00, 0x00, 0x00, // flags
    id >> 24, id >> 16 & 0XFF, id >> 8 & 0XFF, id & 0xFF, // track_ID
    0x00, 0x00, 0x00, 0x01, // default_sample_description_index
    0x00, 0x00, 0x00, 0x00, // default_sample_duration
    0x00, 0x00, 0x00, 0x00, // default_sample_size
    0x00, 0x01, 0x00, 0x01 // default_sample_flags
    ]));
  }

  static trun(track, offset) {
    var samples = track.samples || [],
        len = samples.length,
        arraylen = 12 + 16 * len,
        array = new Uint8Array(arraylen),
        i,
        sample,
        duration,
        size,
        flags,
        cts; //sample = samples[0];
    //       console.log( "trun==> ",sample.duration, sample.cts ,sample.size,len );

    offset += 8 + arraylen;
    array.set([0x00, // version 0
    0x00, 0x0f, 0x01, // flags
    len >>> 24 & 0xFF, len >>> 16 & 0xFF, len >>> 8 & 0xFF, len & 0xFF, // sample_count
    offset >>> 24 & 0xFF, offset >>> 16 & 0xFF, offset >>> 8 & 0xFF, offset & 0xFF // data_offset
    ], 0);

    for (i = 0; i < len; i++) {
      sample = samples[i];
      duration = sample.duration;
      size = sample.size;
      flags = sample.flags;
      cts = sample.cts;
      array.set([duration >>> 24 & 0xFF, duration >>> 16 & 0xFF, duration >>> 8 & 0xFF, duration & 0xFF, // sample_duration
      size >>> 24 & 0xFF, size >>> 16 & 0xFF, size >>> 8 & 0xFF, size & 0xFF, // sample_size
      flags.isLeading << 2 | flags.dependsOn, flags.isDependedOn << 6 | flags.hasRedundancy << 4 | flags.paddingValue << 1 | flags.isNonSync, flags.degradPrio & 0xF0 << 8, flags.degradPrio & 0x0F, // sample_flags
      cts >>> 24 & 0xFF, cts >>> 16 & 0xFF, cts >>> 8 & 0xFF, cts & 0xFF // sample_composition_time_offset
      ], 12 + 16 * i);
    }

    return MP4.box(MP4.types.trun, array);
  }

  static initSegment(tracks) {
    if (!MP4.types) {
      MP4.init();
    }

    var movie = MP4.moov(tracks),
        result;
    result = new Uint8Array(MP4.FTYP.byteLength + movie.byteLength);
    result.set(MP4.FTYP);
    result.set(movie, MP4.FTYP.byteLength);
    return result;
  }

}

var _default = MP4;
exports.default = _default;

},{"core-js/modules/es6.regexp.flags":57}],74:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.array.sort");

require("core-js/modules/es6.regexp.match");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.regexp.flags");

var _aac = _interopRequireDefault(require("../helper/aac"));

var _events = _interopRequireDefault(require("../events"));

var _logger = _interopRequireDefault(require("../utils/logger"));

var _mp4Generator = _interopRequireDefault(require("../remux/mp4-generator"));

var _errors = require("../errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * fMP4 remuxer
 */
class MP4Remuxer {
  constructor(observer, id, config) {
    this.observer = observer;
    this.id = id;
    this.config = config;
    this.ISGenerated = false;
    this.PES2MP4SCALEFACTOR = 4;
    this.PES_TIMESCALE = 90000;
    this.MP4_TIMESCALE = this.PES_TIMESCALE / this.PES2MP4SCALEFACTOR;
    this.nextAvcDts = 90300;
    this.H264_TIMEBASE = 3600;
  }

  get passthrough() {
    return false;
  }

  destroy() {}

  insertDiscontinuity() {
    this._initPTS = this._initDTS = undefined;
  }

  switchLevel() {
    this.ISGenerated = false;
  }

  pushVideo(level, sn, videoTrack, timeOffset, contiguous) {
    this.level = level;
    this.sn = sn;
    let videoData; // generate Init Segment if needed

    if (!this.ISGenerated) {
      this.generateVideoIS(videoTrack, timeOffset);
    }

    if (this.ISGenerated) {
      if (videoTrack.samples.length) {
        this.remuxVideo_2(videoTrack, timeOffset, contiguous);
      }
    }
  }

  remuxVideo_2(track, timeOffset, contiguous, audioTrackLength) {
    var offset = 8,
        pesTimeScale = this.PES_TIMESCALE,
        pes2mp4ScaleFactor = this.PES2MP4SCALEFACTOR,
        mp4SampleDuration,
        mdat,
        moof,
        firstPTS,
        firstDTS,
        nextDTS,
        inputSamples = track.samples,
        outputSamples = [];
    /* concatenate the video data and construct the mdat in place
      (need 8 more bytes to fill length and mpdat type) */

    mdat = new Uint8Array(track.len + 4 * track.nbNalu + 8);
    let view = new DataView(mdat.buffer);
    view.setUint32(0, mdat.byteLength);
    mdat.set(_mp4Generator.default.types.mdat, 4);
    var sampleDuration = 0;
    let ptsnorm, dtsnorm, mp4Sample, lastDTS;

    for (let i = 0; i < inputSamples.length; i++) {
      let avcSample = inputSamples[i],
          mp4SampleLength = 0,
          compositionTimeOffset; // convert NALU bitstream to MP4 format (prepend NALU with size field)

      while (avcSample.units.units.length) {
        let unit = avcSample.units.units.shift();
        view.setUint32(offset, unit.data.byteLength);
        offset += 4;
        mdat.set(unit.data, offset);
        offset += unit.data.byteLength;
        mp4SampleLength += 4 + unit.data.byteLength;
      }

      let pts = avcSample.pts - this._initPTS;
      let dts = avcSample.dts - this._initDTS;
      dts = Math.min(pts, dts);

      if (lastDTS !== undefined) {
        ptsnorm = this._PTSNormalize(pts, lastDTS);
        dtsnorm = this._PTSNormalize(dts, lastDTS);
        sampleDuration = dtsnorm - lastDTS;

        if (sampleDuration <= 0) {
          _logger.default.log("invalid sample duration at PTS/DTS: ".concat(avcSample.pts, "/").concat(avcSample.dts, "|dts norm: ").concat(dtsnorm, "|lastDTS: ").concat(lastDTS, ":").concat(sampleDuration));

          sampleDuration = 1;
        }
      } else {
        var nextAvcDts = this.nextAvcDts,
            delta;
        ptsnorm = this._PTSNormalize(pts, nextAvcDts);
        dtsnorm = this._PTSNormalize(dts, nextAvcDts);

        if (nextAvcDts) {
          delta = Math.round(dtsnorm - nextAvcDts);

          if (
          /*contiguous ||*/
          Math.abs(delta) < 600) {
            if (delta) {
              if (delta > 1) {
                _logger.default.log("AVC:".concat(delta, " ms hole between fragments detected,filling it"));
              } else if (delta < -1) {
                _logger.default.log("AVC:".concat(-delta, " ms overlapping between fragments detected"));
              }

              dtsnorm = nextAvcDts;
              ptsnorm = Math.max(ptsnorm - delta, dtsnorm);

              _logger.default.log("Video/PTS/DTS adjusted: ".concat(ptsnorm, "/").concat(dtsnorm, ",delta:").concat(delta));
            }
          }
        }

        this.firstPTS = Math.max(0, ptsnorm);
        this.firstDTS = Math.max(0, dtsnorm);
        sampleDuration = 0.03;
      }

      outputSamples.push({
        size: mp4SampleLength,
        duration: this.H264_TIMEBASE,
        cts: 0,
        flags: {
          isLeading: 0,
          isDependedOn: 0,
          hasRedundancy: 0,
          degradPrio: 0,
          dependsOn: avcSample.key ? 2 : 1,
          isNonSync: avcSample.key ? 0 : 1
        }
      });
      lastDTS = dtsnorm;
    }

    var lastSampleDuration = 0;

    if (outputSamples.length >= 2) {
      lastSampleDuration = outputSamples[outputSamples.length - 2].duration;
      outputSamples[0].duration = lastSampleDuration;
    }

    this.nextAvcDts = dtsnorm + lastSampleDuration;
    let dropped = track.dropped;
    track.len = 0;
    track.nbNalu = 0;
    track.dropped = 0;

    if (outputSamples.length && navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
      let flags = outputSamples[0].flags;
      flags.dependsOn = 2;
      flags.isNonSync = 0;
    }

    track.samples = outputSamples;
    moof = _mp4Generator.default.moof(track.sequenceNumber++, dtsnorm, track);
    track.samples = [];
    let data = {
      id: this.id,
      level: this.level,
      sn: this.sn,
      data1: moof,
      data2: mdat,
      startPTS: ptsnorm,
      endPTS: ptsnorm,
      startDTS: dtsnorm,
      endDTS: dtsnorm,
      type: 'video',
      nb: outputSamples.length,
      dropped: dropped
    };
    this.observer.trigger(_events.default.FRAG_PARSING_DATA, data);
    return data;
  }

  generateVideoIS(videoTrack, timeOffset) {
    var observer = this.observer,
        videoSamples = videoTrack.samples,
        pesTimeScale = this.PES_TIMESCALE,
        tracks = {},
        data = {
      id: this.id,
      level: this.level,
      sn: this.sn,
      tracks: tracks,
      unique: false
    },
        computePTSDTS = this._initPTS === undefined,
        initPTS,
        initDTS;

    if (computePTSDTS) {
      initPTS = initDTS = Infinity;
    }

    if (videoTrack.sps && videoTrack.pps && videoSamples.length) {
      videoTrack.timescale = 90000; //this.MP4_TIMESCALE;

      tracks.video = {
        container: 'video/mp4',
        codec: videoTrack.codec,
        initSegment: _mp4Generator.default.initSegment([videoTrack]),
        metadata: {
          width: videoTrack.width,
          height: videoTrack.height
        }
      };

      if (computePTSDTS) {
        initPTS = Math.min(initPTS, videoSamples[0].pts - this.H264_TIMEBASE);
        initDTS = Math.min(initDTS, videoSamples[0].dts - this.H264_TIMEBASE);
      }
    }

    if (Object.keys(tracks).length) {
      observer.trigger(_events.default.FRAG_PARSING_INIT_SEGMENT, data);
      this.ISGenerated = true;

      if (computePTSDTS) {
        this._initPTS = initPTS;
        this._initDTS = initDTS;
      }
    } else {
      console.log("generateVideoIS ERROR==> ", _errors.ErrorTypes.MEDIA_ERROR);
    }
  }

  remux(level, sn, audioTrack, videoTrack, id3Track, textTrack, timeOffset, contiguous) {
    this.level = level;
    this.sn = sn; // generate Init Segment if needed

    if (!this.ISGenerated) {
      this.generateIS(audioTrack, videoTrack, timeOffset);
    }

    if (this.ISGenerated) {
      // Purposefully remuxing audio before video, so that remuxVideo can use nextAacPts, which is
      // calculated in remuxAudio.
      //logger.log('nb AAC samples:' + audioTrack.samples.length);
      if (audioTrack.samples.length) {
        let audioData = this.remuxAudio(audioTrack, timeOffset, contiguous); //logger.log('nb AVC samples:' + videoTrack.samples.length);

        if (videoTrack.samples.length) {
          let audioTrackLength;

          if (audioData) {
            audioTrackLength = audioData.endPTS - audioData.startPTS;
          }

          this.remuxVideo(videoTrack, timeOffset, contiguous, audioTrackLength);
        }
      } else {
        let videoData; //logger.log('nb AVC samples:' + videoTrack.samples.length);

        if (videoTrack.samples.length) {
          videoData = this.remuxVideo(videoTrack, timeOffset, contiguous);
        }

        if (videoData && audioTrack.codec) {
          this.remuxEmptyAudio(audioTrack, timeOffset, contiguous, videoData);
        }
      }
    } //logger.log('nb ID3 samples:' + audioTrack.samples.length);


    if (id3Track.samples.length) {
      this.remuxID3(id3Track, timeOffset);
    } //logger.log('nb ID3 samples:' + audioTrack.samples.length);


    if (textTrack.samples.length) {
      this.remuxText(textTrack, timeOffset);
    } //notify end of parsing


    this.observer.trigger(_events.default.FRAG_PARSED, {
      id: this.id,
      level: this.level,
      sn: this.sn
    });
  }

  generateIS(audioTrack, videoTrack, timeOffset) {
    var observer = this.observer,
        audioSamples = audioTrack.samples,
        videoSamples = videoTrack.samples,
        pesTimeScale = this.PES_TIMESCALE,
        tracks = {},
        data = {
      id: this.id,
      level: this.level,
      sn: this.sn,
      tracks: tracks,
      unique: false
    },
        computePTSDTS = this._initPTS === undefined,
        initPTS,
        initDTS;

    if (computePTSDTS) {
      initPTS = initDTS = Infinity;
    }

    if (audioTrack.config && audioSamples.length) {
      audioTrack.timescale = audioTrack.audiosamplerate; // MP4 duration (track duration in seconds multiplied by timescale) is coded on 32 bits
      // we know that each AAC sample contains 1024 frames....
      // in order to avoid overflowing the 32 bit counter for large duration, we use smaller timescale (timescale/gcd)
      // we just need to ensure that AAC sample duration will still be an integer (will be 1024/gcd)

      if (audioTrack.timescale * audioTrack.duration > Math.pow(2, 32)) {
        let greatestCommonDivisor = function greatestCommonDivisor(a, b) {
          if (!b) {
            return a;
          }

          return greatestCommonDivisor(b, a % b);
        };

        audioTrack.timescale = audioTrack.audiosamplerate / greatestCommonDivisor(audioTrack.audiosamplerate, 1024);
      }

      _logger.default.log('audio mp4 timescale :' + audioTrack.timescale);

      tracks.audio = {
        container: 'audio/mp4',
        codec: audioTrack.codec,
        initSegment: _mp4Generator.default.initSegment([audioTrack]),
        metadata: {
          channelCount: audioTrack.channelCount
        }
      };

      if (computePTSDTS) {
        // remember first PTS of this demuxing context. for audio, PTS + DTS ...
        initPTS = initDTS = audioSamples[0].pts - pesTimeScale * timeOffset;
      }
    }

    if (videoTrack.sps && videoTrack.pps && videoSamples.length) {
      videoTrack.timescale = this.MP4_TIMESCALE;
      tracks.video = {
        container: 'video/mp4',
        codec: videoTrack.codec,
        initSegment: _mp4Generator.default.initSegment([videoTrack]),
        metadata: {
          width: videoTrack.width,
          height: videoTrack.height
        }
      };

      if (computePTSDTS) {
        initPTS = Math.min(initPTS, videoSamples[0].pts - pesTimeScale * timeOffset);
        initDTS = Math.min(initDTS, videoSamples[0].dts - pesTimeScale * timeOffset);
      }
    }

    if (Object.keys(tracks).length) {
      observer.trigger(_events.default.FRAG_PARSING_INIT_SEGMENT, data);
      this.ISGenerated = true;

      if (computePTSDTS) {
        this._initPTS = initPTS;
        this._initDTS = initDTS;
      }
    } else {
      observer.trigger(_events.default.ERROR, {
        type: _errors.ErrorTypes.MEDIA_ERROR,
        id: this.id,
        details: _errors.ErrorDetails.FRAG_PARSING_ERROR,
        fatal: false,
        reason: 'no audio/video samples found'
      });
    }
  }

  remuxVideo(track, timeOffset, contiguous, audioTrackLength) {
    var offset = 8,
        pesTimeScale = this.PES_TIMESCALE,
        pes2mp4ScaleFactor = this.PES2MP4SCALEFACTOR,
        mp4SampleDuration,
        mdat,
        moof,
        firstPTS,
        firstDTS,
        nextDTS,
        lastPTS,
        lastDTS,
        inputSamples = track.samples,
        outputSamples = []; // PTS is coded on 33bits, and can loop from -2^32 to 2^32
    // PTSNormalize will make PTS/DTS value monotonic, we use last known DTS value as reference value

    let nextAvcDts;

    if (contiguous) {
      // if parsed fragment is contiguous with last one, let's use last DTS value as reference
      nextAvcDts = this.nextAvcDts;
    } else {
      // if not contiguous, let's use target timeOffset
      nextAvcDts = timeOffset * pesTimeScale;
    } // compute first DTS and last DTS, normalize them against reference value


    let sample = inputSamples[0];
    firstDTS = Math.max(this._PTSNormalize(sample.dts, nextAvcDts) - this._initDTS, 0);
    firstPTS = Math.max(this._PTSNormalize(sample.pts, nextAvcDts) - this._initDTS, 0); // check timestamp continuity accross consecutive fragments (this is to remove inter-fragment gap/hole)

    let delta = Math.round((firstDTS - nextAvcDts) / 90); // if fragment are contiguous, detect hole/overlapping between fragments

    if (contiguous) {
      if (delta) {
        if (delta > 1) {
          _logger.default.log("AVC:".concat(delta, " ms hole between fragments detected,filling it"));
        } else if (delta < -1) {
          _logger.default.log("AVC:".concat(-delta, " ms overlapping between fragments detected"));
        } // remove hole/gap : set DTS to next expected DTS


        firstDTS = nextAvcDts;
        inputSamples[0].dts = firstDTS + this._initDTS; // offset PTS as well, ensure that PTS is smaller or equal than new DTS

        firstPTS = Math.max(firstPTS - delta, nextAvcDts);
        inputSamples[0].pts = firstPTS + this._initDTS;

        _logger.default.log("Video/PTS/DTS adjusted: ".concat(firstPTS, "/").concat(firstDTS, ",delta:").concat(delta));
      }
    }

    nextDTS = firstDTS; // compute lastPTS/lastDTS

    sample = inputSamples[inputSamples.length - 1];
    lastDTS = Math.max(this._PTSNormalize(sample.dts, nextAvcDts) - this._initDTS, 0);
    lastPTS = Math.max(this._PTSNormalize(sample.pts, nextAvcDts) - this._initDTS, 0);
    lastPTS = Math.max(lastPTS, lastDTS);
    let vendor = navigator.vendor,
        userAgent = navigator.userAgent,
        isSafari = vendor && vendor.indexOf('Apple') > -1 && userAgent && !userAgent.match('CriOS'); // on Safari let's signal the same sample duration for all samples
    // sample duration (as expected by trun MP4 boxes), should be the delta between sample DTS
    // set this constant duration as being the avg delta between consecutive DTS.

    if (isSafari) {
      mp4SampleDuration = Math.round((lastDTS - firstDTS) / (pes2mp4ScaleFactor * (inputSamples.length - 1)));
    } // normalize all PTS/DTS now ...


    for (let i = 0; i < inputSamples.length; i++) {
      let sample = inputSamples[i];

      if (isSafari) {
        // sample DTS is computed using a constant decoding offset (mp4SampleDuration) between samples
        sample.dts = firstDTS + i * pes2mp4ScaleFactor * mp4SampleDuration;
      } else {
        // ensure sample monotonic DTS
        sample.dts = Math.max(this._PTSNormalize(sample.dts, nextAvcDts) - this._initDTS, firstDTS); // ensure dts is a multiple of scale factor to avoid rounding issues

        sample.dts = Math.round(sample.dts / pes2mp4ScaleFactor) * pes2mp4ScaleFactor;
      } // we normalize PTS against nextAvcDts, we also substract initDTS (some streams don't start @ PTS O)
      // and we ensure that computed value is greater or equal than sample DTS


      sample.pts = Math.max(this._PTSNormalize(sample.pts, nextAvcDts) - this._initDTS, sample.dts); // ensure pts is a multiple of scale factor to avoid rounding issues

      sample.pts = Math.round(sample.pts / pes2mp4ScaleFactor) * pes2mp4ScaleFactor;
    }
    /* concatenate the video data and construct the mdat in place
      (need 8 more bytes to fill length and mpdat type) */


    mdat = new Uint8Array(track.len + 4 * track.nbNalu + 8);
    let view = new DataView(mdat.buffer);
    view.setUint32(0, mdat.byteLength);
    mdat.set(_mp4Generator.default.types.mdat, 4);

    for (let i = 0; i < inputSamples.length; i++) {
      let avcSample = inputSamples[i],
          mp4SampleLength = 0,
          compositionTimeOffset; // convert NALU bitstream to MP4 format (prepend NALU with size field)

      while (avcSample.units.units.length) {
        let unit = avcSample.units.units.shift();
        view.setUint32(offset, unit.data.byteLength);
        offset += 4;
        mdat.set(unit.data, offset);
        offset += unit.data.byteLength;
        mp4SampleLength += 4 + unit.data.byteLength;
      }

      if (!isSafari) {
        // expected sample duration is the Decoding Timestamp diff of consecutive samples
        if (i < inputSamples.length - 1) {
          mp4SampleDuration = inputSamples[i + 1].dts - avcSample.dts;
        } else {
          let config = this.config,
              lastFrameDuration = avcSample.dts - inputSamples[i > 0 ? i - 1 : i].dts;

          if (config.stretchShortVideoTrack) {
            // In some cases, a segment's audio track duration may exceed the video track duration.
            // Since we've already remuxed audio, and we know how long the audio track is, we look to
            // see if the delta to the next segment is longer than the minimum of maxBufferHole and
            // maxSeekHole. If so, playback would potentially get stuck, so we artificially inflate
            // the duration of the last frame to minimize any potential gap between segments.
            let maxBufferHole = config.maxBufferHole,
                maxSeekHole = config.maxSeekHole,
                gapTolerance = Math.floor(Math.min(maxBufferHole, maxSeekHole) * pesTimeScale),
                deltaToFrameEnd = (audioTrackLength ? firstPTS + audioTrackLength * pesTimeScale : this.nextAacPts) - avcSample.pts;

            if (deltaToFrameEnd > gapTolerance) {
              // We subtract lastFrameDuration from deltaToFrameEnd to try to prevent any video
              // frame overlap. maxBufferHole/maxSeekHole should be >> lastFrameDuration anyway.
              mp4SampleDuration = deltaToFrameEnd - lastFrameDuration;

              if (mp4SampleDuration < 0) {
                mp4SampleDuration = lastFrameDuration;
              }

              _logger.default.log("It is approximately ".concat(deltaToFrameEnd / 90, " ms to the next segment; using duration ").concat(mp4SampleDuration / 90, " ms for the last video frame."));
            } else {
              mp4SampleDuration = lastFrameDuration;
            }
          } else {
            mp4SampleDuration = lastFrameDuration;
          }
        }

        mp4SampleDuration /= pes2mp4ScaleFactor;
        compositionTimeOffset = Math.round((avcSample.pts - avcSample.dts) / pes2mp4ScaleFactor);
      } else {
        compositionTimeOffset = Math.max(0, mp4SampleDuration * Math.round((avcSample.pts - avcSample.dts) / (pes2mp4ScaleFactor * mp4SampleDuration)));
      }

      outputSamples.push({
        size: mp4SampleLength,
        // constant duration
        duration: mp4SampleDuration,
        cts: compositionTimeOffset,
        flags: {
          isLeading: 0,
          isDependedOn: 0,
          hasRedundancy: 0,
          degradPrio: 0,
          dependsOn: avcSample.key ? 2 : 1,
          isNonSync: avcSample.key ? 0 : 1
        }
      });
    } // next AVC sample DTS should be equal to last sample DTS + last sample duration (in PES timescale)


    this.nextAvcDts = lastDTS + mp4SampleDuration * pes2mp4ScaleFactor;
    let dropped = track.dropped;
    track.len = 0;
    track.nbNalu = 0;
    track.dropped = 0;

    if (outputSamples.length && navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
      let flags = outputSamples[0].flags; // chrome workaround, mark first sample as being a Random Access Point to avoid sourcebuffer append issue
      // https://code.google.com/p/chromium/issues/detail?id=229412

      flags.dependsOn = 2;
      flags.isNonSync = 0;
    }

    track.samples = outputSamples;
    moof = _mp4Generator.default.moof(track.sequenceNumber++, firstDTS / pes2mp4ScaleFactor, track);
    track.samples = [];
    let data = {
      id: this.id,
      level: this.level,
      sn: this.sn,
      data1: moof,
      data2: mdat,
      startPTS: firstPTS / pesTimeScale,
      endPTS: (lastPTS + pes2mp4ScaleFactor * mp4SampleDuration) / pesTimeScale,
      startDTS: firstPTS / pesTimeScale,
      endDTS: (lastPTS + pes2mp4ScaleFactor * mp4SampleDuration) / pesTimeScale,
      // startDTS: firstDTS / pesTimeScale,
      // endDTS: this.nextAvcDts / pesTimeScale,
      type: 'video',
      nb: outputSamples.length,
      dropped: dropped
    };
    this.observer.trigger(_events.default.FRAG_PARSING_DATA, data);
    return data;
  }

  remuxAudio(track, timeOffset, contiguous) {
    let pesTimeScale = this.PES_TIMESCALE,
        mp4timeScale = track.timescale,
        pes2mp4ScaleFactor = pesTimeScale / mp4timeScale,
        expectedSampleDuration = track.timescale * 1024 / track.audiosamplerate;
    var view,
        offset = 8,
        aacSample,
        mp4Sample,
        unit,
        mdat,
        moof,
        firstPTS,
        firstDTS,
        lastDTS,
        pts,
        dts,
        ptsnorm,
        dtsnorm,
        samples = [],
        samples0 = [];
    track.samples.sort(function (a, b) {
      return a.pts - b.pts;
    });
    samples0 = track.samples;
    let nextAacPts = contiguous ? this.nextAacPts : timeOffset * pesTimeScale; // If the audio track is missing samples, the frames seem to get "left-shifted" within the
    // resulting mp4 segment, causing sync issues and leaving gaps at the end of the audio segment.
    // In an effort to prevent this from happening, we inject frames here where there are gaps.
    // When possible, we inject a silent frame; when that's not possible, we duplicate the last
    // frame.

    let firstPtsNorm = this._PTSNormalize(samples0[0].pts - this._initPTS, nextAacPts),
        pesFrameDuration = expectedSampleDuration * pes2mp4ScaleFactor;

    var nextPtsNorm = firstPtsNorm + pesFrameDuration;

    for (var i = 1; i < samples0.length;) {
      // First, let's see how far off this frame is from where we expect it to be
      var sample = samples0[i],
          ptsNorm = this._PTSNormalize(sample.pts - this._initPTS, nextAacPts),
          delta = ptsNorm - nextPtsNorm; // If we're overlapping by more than half a duration, drop this sample


      if (delta < -0.5 * pesFrameDuration) {
        _logger.default.log("Dropping frame due to ".concat(Math.abs(delta / 90), " ms overlap."));

        samples0.splice(i, 1);
        track.len -= sample.unit.length; // Don't touch nextPtsNorm or i
      } // Otherwise, if we're more than half a frame away from where we should be, insert missing frames
      else if (delta > 0.5 * pesFrameDuration) {
          var missing = Math.round(delta / pesFrameDuration);

          _logger.default.log("Injecting ".concat(missing, " frame").concat(missing > 1 ? 's' : '', " of missing audio due to ").concat(Math.round(delta / 90), " ms gap."));

          for (var j = 0; j < missing; j++) {
            var newStamp = samples0[i - 1].pts + pesFrameDuration,
                fillFrame = _aac.default.getSilentFrame(track.channelCount);

            if (!fillFrame) {
              _logger.default.log('Unable to get silent frame for given audio codec; duplicating last frame instead.');

              fillFrame = sample.unit.slice(0);
            }

            samples0.splice(i, 0, {
              unit: fillFrame,
              pts: newStamp,
              dts: newStamp
            });
            track.len += fillFrame.length;
            i += 1;
          } // Adjust sample to next expected pts


          nextPtsNorm += (missing + 1) * pesFrameDuration;
          sample.pts = samples0[i - 1].pts + pesFrameDuration;
          i += 1;
        } // Otherwise, we're within half a frame duration, so just adjust pts
        else {
            if (Math.abs(delta) > 0.1 * pesFrameDuration) {
              _logger.default.log("Invalid frame delta ".concat(ptsNorm - nextPtsNorm + pesFrameDuration, " at PTS ").concat(Math.round(ptsNorm / 90), " (should be ").concat(pesFrameDuration, ")."));
            }

            nextPtsNorm += pesFrameDuration;
            sample.pts = samples0[i - 1].pts + pesFrameDuration;
            i += 1;
          }
    }

    while (samples0.length) {
      aacSample = samples0.shift();
      unit = aacSample.unit;
      pts = aacSample.pts - this._initDTS;
      dts = aacSample.dts - this._initDTS; //logger.log(`Audio/PTS:${Math.round(pts/90)}`);
      // if not first sample

      if (lastDTS !== undefined) {
        ptsnorm = this._PTSNormalize(pts, lastDTS);
        dtsnorm = this._PTSNormalize(dts, lastDTS);
        mp4Sample.duration = (dtsnorm - lastDTS) / pes2mp4ScaleFactor;
      } else {
        ptsnorm = this._PTSNormalize(pts, nextAacPts);
        dtsnorm = this._PTSNormalize(dts, nextAacPts);
        let delta = Math.round(1000 * (ptsnorm - nextAacPts) / pesTimeScale); // if fragment are contiguous, detect hole/overlapping between fragments

        if (contiguous) {
          // log delta
          if (delta) {
            if (delta > 0) {
              _logger.default.log("".concat(delta, " ms hole between AAC samples detected,filling it")); // if we have frame overlap, overlapping for more than half a frame duraion

            } else if (delta < -12) {
              // drop overlapping audio frames... browser will deal with it
              _logger.default.log("".concat(-delta, " ms overlapping between AAC samples detected, drop frame"));

              track.len -= unit.byteLength;
              continue;
            } // set PTS/DTS to expected PTS/DTS


            ptsnorm = dtsnorm = nextAacPts;
          }
        } // remember first PTS of our aacSamples, ensure value is positive


        firstPTS = Math.max(0, ptsnorm);
        firstDTS = Math.max(0, dtsnorm);

        if (track.len > 0) {
          /* concatenate the audio data and construct the mdat in place
            (need 8 more bytes to fill length and mdat type) */
          mdat = new Uint8Array(track.len + 8);
          view = new DataView(mdat.buffer);
          view.setUint32(0, mdat.byteLength);
          mdat.set(_mp4Generator.default.types.mdat, 4);
        } else {
          // no audio samples
          return;
        }
      }

      mdat.set(unit, offset);
      offset += unit.byteLength; //console.log('PTS/DTS/initDTS/normPTS/normDTS/relative PTS : ${aacSample.pts}/${aacSample.dts}/${this._initDTS}/${ptsnorm}/${dtsnorm}/${(aacSample.pts/4294967296).toFixed(3)}');

      mp4Sample = {
        size: unit.byteLength,
        cts: 0,
        duration: 0,
        flags: {
          isLeading: 0,
          isDependedOn: 0,
          hasRedundancy: 0,
          degradPrio: 0,
          dependsOn: 1
        }
      };
      samples.push(mp4Sample);
      lastDTS = dtsnorm;
    }

    var lastSampleDuration = 0;
    var nbSamples = samples.length; //set last sample duration as being identical to previous sample

    if (nbSamples >= 2) {
      lastSampleDuration = samples[nbSamples - 2].duration;
      mp4Sample.duration = lastSampleDuration;
    }

    if (nbSamples) {
      // next aac sample PTS should be equal to last sample PTS + duration
      this.nextAacPts = ptsnorm + pes2mp4ScaleFactor * lastSampleDuration; //logger.log('Audio/PTS/PTSend:' + aacSample.pts.toFixed(0) + '/' + this.nextAacDts.toFixed(0));

      track.len = 0;
      track.samples = samples;
      moof = _mp4Generator.default.moof(track.sequenceNumber++, firstDTS / pes2mp4ScaleFactor, track);
      track.samples = [];
      let audioData = {
        id: this.id,
        level: this.level,
        sn: this.sn,
        data1: moof,
        data2: mdat,
        startPTS: firstPTS / pesTimeScale,
        endPTS: this.nextAacPts / pesTimeScale,
        startDTS: firstDTS / pesTimeScale,
        endDTS: (dtsnorm + pes2mp4ScaleFactor * lastSampleDuration) / pesTimeScale,
        type: 'audio',
        nb: nbSamples
      };
      this.observer.trigger(_events.default.FRAG_PARSING_DATA, audioData);
      return audioData;
    }

    return null;
  }

  remuxEmptyAudio(track, timeOffset, contiguous, videoData) {
    let pesTimeScale = this.PES_TIMESCALE,
        mp4timeScale = track.timescale ? track.timescale : track.audiosamplerate,
        pes2mp4ScaleFactor = pesTimeScale / mp4timeScale,
        // sync with video's timestamp
    startDTS = videoData.startDTS * pesTimeScale + this._initDTS,
        endDTS = videoData.endDTS * pesTimeScale + this._initDTS,
        // one sample's duration value
    sampleDuration = 1024,
        frameDuration = pes2mp4ScaleFactor * sampleDuration,
        // samples count of this segment's duration
    nbSamples = Math.ceil((endDTS - startDTS) / frameDuration),
        // silent frame
    silentFrame = _aac.default.getSilentFrame(track.channelCount); // Can't remux if we can't generate a silent frame...


    if (!silentFrame) {
      _logger.default.trace('Unable to remuxEmptyAudio since we were unable to get a silent frame for given audio codec!');

      return;
    }

    let samples = [];

    for (var i = 0; i < nbSamples; i++) {
      var stamp = startDTS + i * frameDuration;
      samples.push({
        unit: silentFrame.slice(0),
        pts: stamp,
        dts: stamp
      });
      track.len += silentFrame.length;
    }

    track.samples = samples;
    this.remuxAudio(track, timeOffset, contiguous);
  }

  remuxID3(track, timeOffset) {
    var length = track.samples.length,
        sample; // consume samples

    if (length) {
      for (var index = 0; index < length; index++) {
        sample = track.samples[index]; // setting id3 pts, dts to relative time
        // using this._initPTS and this._initDTS to calculate relative time

        sample.pts = (sample.pts - this._initPTS) / this.PES_TIMESCALE;
        sample.dts = (sample.dts - this._initDTS) / this.PES_TIMESCALE;
      }

      this.observer.trigger(_events.default.FRAG_PARSING_METADATA, {
        id: this.id,
        level: this.level,
        sn: this.sn,
        samples: track.samples
      });
    }

    track.samples = [];
    timeOffset = timeOffset;
  }

  remuxText(track, timeOffset) {
    track.samples.sort(function (a, b) {
      return a.pts - b.pts;
    });
    var length = track.samples.length,
        sample; // consume samples

    if (length) {
      for (var index = 0; index < length; index++) {
        sample = track.samples[index]; // setting text pts, dts to relative time
        // using this._initPTS and this._initDTS to calculate relative time

        sample.pts = (sample.pts - this._initPTS) / this.PES_TIMESCALE;
      }

      this.observer.trigger(_events.default.FRAG_PARSING_USERDATA, {
        id: this.id,
        level: this.level,
        sn: this.sn,
        samples: track.samples
      });
    }

    track.samples = [];
    timeOffset = timeOffset;
  }

  _PTSNormalize(value, reference) {
    var offset;

    if (reference === undefined) {
      return value;
    }

    if (reference < value) {
      // - 2^33
      offset = -8589934592;
    } else {
      // + 2^33
      offset = 8589934592;
    }
    /* PTS is 33bit (from 0 to 2^33 -1)
      if diff between value and reference is bigger than half of the amplitude (2^32) then it means that
      PTS looping occured. fill the gap */


    while (Math.abs(value - reference) > 4294967296) {
      value += offset;
    }

    return value;
  }

}

var _default = MP4Remuxer;
exports.default = _default;

},{"../errors":67,"../events":69,"../helper/aac":70,"../remux/mp4-generator":73,"../utils/logger":76,"core-js/modules/es6.array.sort":55,"core-js/modules/es6.regexp.flags":57,"core-js/modules/es6.regexp.match":58,"core-js/modules/web.dom.iterable":61}],75:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _events = _interopRequireDefault(require("../events"));

var _eventHandler = _interopRequireDefault(require("../event-handler"));

var _h264Demuxer = _interopRequireDefault(require("../demux/h264-demuxer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * H264 NAL Slicer
 */
class SlicesReader extends _eventHandler.default {
  constructor(wfs) {
    let config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    super(wfs, _events.default.H264_DATA_PARSING);
    this.config = this.wfs.config || config;
    this.h264Demuxer = new _h264Demuxer.default(wfs);
    this.wfs = wfs;
    this.lastBuf = null;
    this.nals = [];
  }

  destroy() {
    this.lastBuf = null;
    this.nals = [];

    _eventHandler.default.prototype.destroy.call(this);
  }

  _read(buffer) {
    var typedAr = null;
    this.nals = [];
    if (!buffer || buffer.byteLength < 1) return;

    if (this.lastBuf) {
      typedAr = new Uint8Array(buffer.byteLength + this.lastBuf.length);
      typedAr.set(this.lastBuf);
      typedAr.set(new Uint8Array(buffer), this.lastBuf.length);
    } else {
      typedAr = new Uint8Array(buffer);
    }

    var lastNalEndPos = 0;
    var b1 = -1; // byte before one

    var b2 = -2; // byte before two

    var nalStartPos = new Array();

    for (var i = 0; i < typedAr.length; i += 2) {
      var b_0 = typedAr[i];
      var b_1 = typedAr[i + 1];

      if (b1 == 0 && b_0 == 0 && b_1 == 0) {
        nalStartPos.push(i - 1);
      } else if (b_1 == 1 && b_0 == 0 && b1 == 0 && b2 == 0) {
        nalStartPos.push(i - 2);
      }

      b2 = b_0;
      b1 = b_1;
    }

    if (nalStartPos.length > 1) {
      for (var i = 0; i < nalStartPos.length - 1; ++i) {
        this.nals.push(typedAr.subarray(nalStartPos[i], nalStartPos[i + 1] + 1));
        lastNalEndPos = nalStartPos[i + 1];
      }
    } else {
      lastNalEndPos = nalStartPos[0];
    }

    if (lastNalEndPos != 0 && lastNalEndPos < typedAr.length) {
      this.lastBuf = typedAr.subarray(lastNalEndPos);
    } else {
      if (!!!this.lastBuf) {
        this.lastBuf = typedAr;
      }

      var _newBuf = new Uint8Array(this.lastBuf.length + buffer.byteLength);

      _newBuf.set(this.lastBuf);

      _newBuf.set(new Uint8Array(buffer), this.lastBuf.length);

      this.lastBuf = _newBuf;
    }
  }

  onH264DataParsing(event) {
    this._read(event.data);

    var $this = this;
    this.nals.forEach(function (nal) {
      $this.wfs.trigger(_events.default.H264_DATA_PARSED, {
        data: nal
      });
    });
  }

}

var _default = SlicesReader;
exports.default = _default;

},{"../demux/h264-demuxer":66,"../event-handler":68,"../events":69}],76:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logger = exports.enableLogs = void 0;

function noop() {}

const fakeLogger = {
  trace: noop,
  debug: noop,
  log: noop,
  warn: noop,
  info: noop,
  error: noop
};
let exportedLogger = fakeLogger; //let lastCallTime;
// function formatMsgWithTimeInfo(type, msg) {
//   const now = Date.now();
//   const diff = lastCallTime ? '+' + (now - lastCallTime) : '0';
//   lastCallTime = now;
//   msg = (new Date(now)).toISOString() + ' | [' +  type + '] > ' + msg + ' ( ' + diff + ' ms )';
//   return msg;
// }

function formatMsg(type, msg) {
  msg = '[' + type + '] > ' + msg;
  return msg;
}

function consolePrintFn(type) {
  const func = window.console[type];

  if (func) {
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (args[0]) {
        args[0] = formatMsg(type, args[0]);
      }

      func.apply(window.console, args);
    };
  }

  return noop;
}

function exportLoggerFunctions(debugConfig) {
  for (var _len2 = arguments.length, functions = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    functions[_key2 - 1] = arguments[_key2];
  }

  functions.forEach(function (type) {
    exportedLogger[type] = debugConfig[type] ? debugConfig[type].bind(debugConfig) : consolePrintFn(type);
  });
}

var enableLogs = function enableLogs(debugConfig) {
  if (debugConfig === true || typeof debugConfig === 'object') {
    exportLoggerFunctions(debugConfig, // Remove out from list here to hard-disable a log-level
    //'trace',
    'debug', 'log', 'info', 'warn', 'error'); // Some browsers don't allow to use bind on console object anyway
    // fallback to default if needed

    try {
      exportedLogger.log();
    } catch (e) {
      exportedLogger = fakeLogger;
    }
  } else {
    exportedLogger = fakeLogger;
  }
};

exports.enableLogs = enableLogs;
var logger = exportedLogger;
exports.logger = logger;

},{}],77:[function(require,module,exports){
/**
 * WFS interface, Jeff Yang 2016.10
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _events = _interopRequireDefault(require("./events"));

var _flowController = _interopRequireDefault(require("./controller/flow-controller"));

var _bufferController = _interopRequireDefault(require("./controller/buffer-controller"));

var _events2 = _interopRequireDefault(require("events"));

var _websocketLoader = _interopRequireDefault(require("./loader/websocket-loader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Wfs {
  static get version() {
    // replaced with browserify-versionify transform
    return '' + 'v.0.0.0.1';
  }

  static isSupported() {
    return window.MediaSource && typeof window.MediaSource.isTypeSupported === 'function' && window.MediaSource.isTypeSupported('video/mp4; codecs="avc1.42c01f,mp4a.40.2"');
  }

  static get Events() {
    return _events.default;
  }

  static get DefaultConfig() {
    if (!Wfs.defaultConfig) {
      Wfs.defaultConfig = {
        autoStartLoad: true,
        startPosition: -1,
        debug: false,
        fLoader: undefined,
        fragLoadingTimeOut: 20000,
        fragLoadingMaxRetry: 6,
        fragLoadingRetryDelay: 1000,
        fragLoadingMaxRetryTimeout: 64000,
        fragLoadingLoopThreshold: 3,
        forceKeyFrameOnDiscontinuity: true,
        appendErrorMaxRetry: 3
      };
    }

    return Wfs.defaultConfig;
  }

  static set DefaultConfig(defaultConfig) {
    Wfs.defaultConfig = defaultConfig;
  }

  constructor(ws_server) {
    let config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    this.ws_server = ws_server;
    var defaultConfig = Wfs.DefaultConfig;

    for (var prop in defaultConfig) {
      if (prop in config) {
        continue;
      }

      config[prop] = defaultConfig[prop];
    }

    this.config = config; // observer setup

    var observer = this.observer = new _events2.default();

    observer.trigger = function trigger(event) {
      for (var _len = arguments.length, data = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        data[_key - 1] = arguments[_key];
      }

      observer.emit(event, event, ...data);
    };

    observer.off = function off(event) {
      for (var _len2 = arguments.length, data = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        data[_key2 - 1] = arguments[_key2];
      }

      observer.removeListener(event, ...data);
    };

    this.on = observer.on.bind(observer);
    this.off = observer.off.bind(observer);
    this.trigger = observer.trigger.bind(observer);
    this.flowController = new _flowController.default(this);
    this.bufferController = new _bufferController.default(this);
    this.websocketLoader = new _websocketLoader.default(this);
    this.mediaType = undefined;
  }

  destroy() {
    this.flowController.destroy();
    this.bufferController.destroy();
    this.websocketLoader.destroy();
  }

  attachMedia(media) {
    let channelName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'tv';
    let mediaType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'H264Raw';
    let websocketName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'play2';
    this.mediaType = mediaType;
    this.media = media;
    this.trigger(_events.default.MEDIA_ATTACHING, {
      media: media,
      channelName: channelName,
      mediaType: mediaType,
      websocketName: websocketName
    });
  }

  attachWebsocket(websocket, channelName) {
    this.trigger(_events.default.WEBSOCKET_ATTACHING, {
      websocket: websocket,
      mediaType: this.mediaType,
      channelName: channelName
    });
  }

}

var _default = Wfs;
exports.default = _default;

},{"./controller/buffer-controller":63,"./controller/flow-controller":64,"./events":69,"./loader/websocket-loader":72,"events":62}]},{},[71])(71)
});
