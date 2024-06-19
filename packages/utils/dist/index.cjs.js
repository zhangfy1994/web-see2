'use strict';

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  //
  // Note to future-self: No, you can't remove the `toLowerCase()` call.
  // REF: https://github.com/uuidjs/uuid/pull/677#issuecomment-1757351351
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).

var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }
  return getRandomValues(rnds8);
}

var randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native = {
  randomUUID
};

function v4(options, buf, offset) {
  if (native.randomUUID && !buf && !options) {
    return native.randomUUID();
  }
  options = options || {};
  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80;
  return unsafeStringify(rnds);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
class Queue {
    constructor() {
        this.stack = [];
        this.isFlushing = false;
    }
    addFn(fn) {
        this.stack.push(fn);
        if (!this.isFlushing) {
            this.isFlushing = true;
            if ('requestIdleCallback' in window) {
                requestIdleCallback(this.flush.bind(this));
            }
            else if ('Promise' in window) {
                Promise.resolve().then(this.flush.bind(this));
            }
            else {
                setTimeout(this.flush.bind(this), 0);
            }
        }
    }
    flush() {
        const temp = this.stack.slice(0);
        this.stack = [];
        this.isFlushing = false;
        temp.forEach((fn) => {
            fn();
        });
    }
    clear() {
        this.stack = [];
    }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
// 获取当前的时间戳
function getTimestamp() {
    return Date.now();
}
// 判断类型
function typeofAny(target) {
    return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
}
// 设置属性
function bindOptionsHelp(target, key, value, type) {
    if (!target)
        return false;
    if (typeofAny(value) === type) {
        target[key] = value;
        return true;
    }
    return false;
}
// 生成uuid
function generateUUID() {
    return v4();
}
//replaceAop
function replaceAop(target, property, replaceCb) {
    if (!(property in target))
        return;
    const originFn = target[property];
    const wrap = replaceCb(originFn);
    if (typeof wrap === 'function') {
        target[property] = wrap;
    }
}
// 事件监听
function on(target, event, handle, options = false) {
    target.addEventListener(event, handle, options);
}
// 对每一个错误详情，生成唯一的编码
function getErrorUid(input) {
    return window.btoa(encodeURIComponent(input));
}

exports.Queue = Queue;
exports.bindOptionsHelp = bindOptionsHelp;
exports.generateUUID = generateUUID;
exports.getErrorUid = getErrorUid;
exports.getTimestamp = getTimestamp;
exports.on = on;
exports.replaceAop = replaceAop;
exports.typeofAny = typeofAny;
//# sourceMappingURL=index.cjs.js.map
