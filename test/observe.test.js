/* eslint-env mocha */

const it = require('mocha-param')
const observe = require('../lib/observe')
describe('Observable', () => {
  it('简单对象操作', [{}]
    , () => {
      let x = observe({ a: { b: 1 } }, (change) => {
        console.log(change)
      })
      x.a.b = 2
    })
})
