# @superjs/observe
use Proxy to observe changes for nested object
## Example
```javascript
const observe = require('@superjs/observe')
let x=observe({a:{b:1}},(change)=>{
  console.log(change)
})
x.a.b=2
```
The argument `change` will be output as below:
```
{
  key: 'a',
  type: 'object',
  data: {
    a: { b: 2 }
  },
  change: {
    key: 'b',
    type: 'object',
    data: { b: 2 },
    change: { data: 2 }
  }
}
```
For array type, only changes for NormalInteger keys will be tracked:
```javascript
const observe = require('@superjs/observe')
let x=observe({a:{b:[]}},(change)=>{
  console.log(change)
})
x.a.b.c=2
```
Nothing will be output.
