exports.isPrimitive = require('is-primitive')
exports.isPlainObject = require('is-plain-object')

// https://stackoverflow.com/questions/10834796/validate-that-a-string-is-a-positive-integer
exports.isNormalIntegerStr = function (str) {
  var n = Math.floor(Number(str))
  return n !== Infinity && String(n) === str && n >= 0
}

exports.isArray = Array.isArray
exports.isFunction = function (x) {
  return typeof x === 'function'
}

