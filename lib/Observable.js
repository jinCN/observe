const s = require('./symbols')
const utils = require('./utils')
module.exports = Observable
const ObservableHandler = require('./ObservableHandler')

function Observable (target) {
  let type
  if (utils.isArray(target)) {
    type = 'array'
  } else if (utils.isPlainObject(target)) {
    type = 'object'
  } else {
    // noinspection all
    return null
  }

  // 已经是一个Observable
  if (target[s.handler]) {
    return target
  }
  let handler = new ObservableHandler(target, type)
  return new Proxy(target, handler)
}
