/* eslint-env mocha */

const assert = require('assert')
const it = require('mocha-param')
const observe = require('../lib/observe')
describe('Observable', () => {
  
  it('简单对象操作', [{}]
    , (obj) => {
      let x = observe({ a: { b: 1 } }, (change) => {
        console.log(change)
      })
      x.a.b = 2
    })
  
})
