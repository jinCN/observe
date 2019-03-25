//module.exports = new Proxy({}, {
//  get (target, key) {
//    target[key] = target[key] || Symbol(key)
//    return target[key]
//  }
//})

module.exports = {
  handler: Symbol('handler')
}
