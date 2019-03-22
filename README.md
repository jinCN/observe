# koa-router-dir
composite a dir to a router

## Example
```javascript
const Koa = require('koa')
const koaRouterDir = require('koa-router-dir');
const app = new Koa()
app.use(koaRouterDir(__dirname+'/routers'))
```

