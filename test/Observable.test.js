/* eslint-env mocha */

const assert = require('assert')
const it = require('mocha-param')
const Observable = require('../lib/Observable')
const s = require('../lib/symbols')
const util = require('util')

describe('Observable', () => {
  
  it('简单对象操作', [
    {
      a: [{ a: 1 }, Buffer.from('abc'), 2],
      b: { a: { b: {}, c: {} } },
      c: new Date()
    }
  ], (obj) => {
    let p = Observable(obj)
    p[s.handler].fn.push(v => console.log(`change:`, util.inspect(v, { depth: null })))
    console.log(`1:`, 1)
    p.a[0].a++
    let x = p.a
    x[1] = Buffer.from('def')
    p.b.a.b.x = 1
    p.c.setMonth(3)
    
  })
  
  it('共享对象操作', [
    {
      a: [{ a: 1 }, Buffer.from('abc'), 2],
      b: { a: { b: {}, c: {} } },
      c: new Date()
    }
  ], (obj) => {
    let p = Observable(obj)
    p[s.handler].fn.push(v => console.log(`change1:`, util.inspect(v, { depth: null })))
    
    let p2 = Observable({})
    p2[s.handler].fn.push(v => console.log(`change2:`, util.inspect(v, { depth: null })))
    p2.x = p.a[0]
    p2.x.a++
    return 1
  })
})
