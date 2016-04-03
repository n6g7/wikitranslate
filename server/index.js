'use strict';

let apiRouter = require('./api');
let koa = require('koa');
let koaCors = require('koa-cors');
let koaRouter = require('koa-router');

let app = koa();
let router = koaRouter();

app.use(koaCors({ methods: 'GET' }));

app.use(function* pageNotFound(next) {
  yield next;

  if (this.status != 404) return;

  this.status = 404;
  this.body = 'Invalid request. Usage : /fromLang/toLang/Word. Example : /en/fr/london.';
});

router.use('/api', apiRouter.routes(), apiRouter.allowedMethods());

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app.listen(process.env.PORT || 3000);
