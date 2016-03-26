'use strict';

let _ = require('lodash');
let koa = require('koa');
let qs = require('querystring');
let translator = require('./lib/translate');

let app = koa();

app.use(function* parseUrl(next) {
  let parts = this.request.url.split('/');

  if (parts.length < 4) this.throw(404, 'Invalid request. Usage : /fromLang/toLang/Word. Example : /en/fr/london.');

  this.state.path = parts.splice(1);

  // Where is destructuring when you need it ?
  this.state.fromLang = this.state.path[0];
  this.state.toLang = this.state.path[1];
  this.state.search = qs.unescape(this.state.path[2]);

  yield next;
});

app.use(function* log(next) {
  yield next;

  let count = _(this.body).values().flatten().size();

  console.log(`Found ${count} translations for "${this.state.search}" (${this.state.fromLang} -> ${this.state.toLang}).`);
});

app.use(function* translate() {
  try {
    this.body = yield translator(this.state.search, this.state.fromLang, this.state.toLang);
  }
  catch (err) {
    this.throw(404, err);
  }
});

module.exports = app.listen(process.env.PORT || 3000);
