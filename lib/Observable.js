const s = require('./symbols')
const utils = require('./utils')
const kindOf = require('kind-of')
module.exports = Observable
const ObservableHandler = require('./ObservableHandler')

function Observable (target) {
  let type = kindOf(target)
  
  if (!['object', 'array'].includes(type)) {
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
