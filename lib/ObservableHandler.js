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
    if (!target.hasOwnProperty(key)) {
      return target[key]
    }
    let value = target[key]
    let observable = Observable(value)
    if (!observable) return value

    return this.initChild(key, observable)
  }

  set (target, key, value) {
    let realValue = value
    // 已经是一个Observable, 取其target
    if (value[s.handler]) {
      realValue = value[s.handler].target
    }
    // 值等于自身, 则不赋值
    if (target.hasOwnProperty(key) && target[key] === realValue) {
      return true
    }
    if (!Reflect.set(target, key, realValue)) {
      throw new Error('set error')
    }
    // 解除旧回调
    if (this.children.hasOwnProperty(key) && this.children[key] !== undefined) {
      this.children[key][s.handler].removeListener(this.childrenFn[key])
      this.children[key] = undefined
      this.childrenFn[key] = undefined
    }

    this.notify(key, { data: realValue })

    let observable = Observable(value)
    if (!observable) return true

    this.initChild(key, observable)
    return true
  }
}
