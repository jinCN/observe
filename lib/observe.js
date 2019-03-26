const Observable = require('./Observable')
const symbols = require('./symbols')
module.exports = function observe (obj, fn) {
  let observable = Observable(obj)
  if (!observable) {
    throw new Error('unsupported type')
  }
  observable[symbols.handler].addListener(fn)
  return observable
}

module.exports.addListener = function (observable, fn) {
  observable[symbols.handler].addListener(fn)
}

module.exports.removeListener = function (observable, fn) {
  observable[symbols.handler].removeListener(fn)
}

module.exports.origin = function (observable) {
  return observable[symbols.handler].target
}
