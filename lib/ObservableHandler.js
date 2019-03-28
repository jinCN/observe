const s = require('./symbols')
const utils = require('./utils')
const Observable = require('./Observable')

module.exports = class ObservableHandler {
  /**
   * target: proxy使用的target
   * tracker: Tracker, 变化时触发的Tracker
   * attach: tracker要使用的信息
   */
  constructor (target, type) {
    this.target = target
    this.type = type
    this.fns = []
    this.children = {}
    this.childrenFn = {}
  }

  notify (key, change) {
    let newChange = { key, change, type: this.type, data: this.target }
    if (this.type === 'array') {
      if (!utils.isNormalIntegerStr(key)) {
        return
      }
    }
    let fn = this.fns.map(v => v)
    fn.forEach(f => f(newChange))
  }

  addListener (fn) {
    this.fns.push(fn)
  }

  removeListener (fn) {
    let index = this.fns.indexOf(fn)
    if (index !== -1) {
      this.fns.splice(index, 1)
    }
  }

  initChild (key, observable) {
    if (!(this.children.hasOwnProperty(key) &&
      this.children[key] !== undefined)) {
      this.childrenFn[key] = this.childrenFn[key] || this.notify.bind(this, key)
      this.children[key] = observable
      observable[s.handler].addListener(this.childrenFn[key])
    }
    return this.children[key]
  }

  get (target, key) {
    if (key === s.handler) {
      return this
    }
    if (typeof key === 'symbol') {
      return target[key]
    }
    if (!target.hasOwnProperty(key)) {
      return target[key]
    }
    let d = Reflect.getOwnPropertyDescriptor(target, key)
    if (d && d.configurable === false && d.writable === false) {
      return target[key]
    }
    let value = target[key]
    let observable = Observable(value)
    if (!observable) return value

    return this.initChild(key, observable)
  }

  set (target, key, value) {
    if (typeof key === 'symbol') {
      return Reflect.set(target, key, value)
    }
    let realValue = value
    // 已经是一个Observable, 取其target
    if (value && value[s.handler]) {
      realValue = value[s.handler].target
    }
    // 值等于自身, 则无后续
    if (target.hasOwnProperty(key) && target[key] === realValue) {
      return Reflect.set(target, key, value)
    }

    if (!Reflect.set(target, key, realValue)) {
      return false
    }

    // 解除旧回调
    if (this.children.hasOwnProperty(key) && this.children[key] !== undefined) {
      this.children[key][s.handler].removeListener(this.childrenFn[key])
      this.children[key] = undefined
      this.childrenFn[key] = undefined
    }

    this.notify(key, { data: realValue })
    let d = Reflect.getOwnPropertyDescriptor(target, key)
    if (d && d.configurable === false && d.writable === false) {
      return true
    }
    let observable = Observable(value)
    if (!observable) return true

    this.initChild(key, observable)
    return true
  }

  defineProperty (target, key, descriptor) {
    if (typeof key === 'symbol') {
      return Reflect.defineProperty(target, key, descriptor)
    }
    if (!descriptor.hasOwnProperty('value')) {
      return Reflect.defineProperty(target, key, descriptor)
    }

    let value = descriptor.value
    let realValue = value
    // 已经是一个Observable, 取其target
    if (value && value[s.handler]) {
      realValue = value[s.handler].target
    }
    // 值等于自身, 则无后续
    if (target.hasOwnProperty(key) && target[key] === realValue) {
      return Reflect.defineProperty(target, key, descriptor)
    }
    if (!Reflect.defineProperty(target, key, descriptor)) {
      return false
    }

    // 解除旧回调
    if (this.children.hasOwnProperty(key) && this.children[key] !== undefined) {
      this.children[key][s.handler].removeListener(this.childrenFn[key])
      this.children[key] = undefined
      this.childrenFn[key] = undefined
    }

    this.notify(key, { data: realValue })
    let d = Reflect.getOwnPropertyDescriptor(target, key)
    if (d && d.configurable === false && d.writable === false) {
      return true
    }
    let observable = Observable(value)
    if (!observable) return true

    this.initChild(key, observable)
    return true
  }
  deleteProperty (target, key) {
    if (typeof key === 'symbol') {
      return Reflect.deleteProperty(target, key)
    }
    if (!target.hasOwnProperty(key)) return true
    if (!Reflect.deleteProperty(target, key)) {
      return false
    }
    // 解除旧回调
    if (this.children.hasOwnProperty(key) && this.children[key] !== undefined) {
      this.children[key][s.handler].removeListener(this.childrenFn[key])
      this.children[key] = undefined
      this.childrenFn[key] = undefined
    }
    this.notify(key, { data: undefined })
    return true
  }
}
