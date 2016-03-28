'use strict';

let _ = require('lodash');
let koa = require('koa');
let koaCors = require('koa-cors');
let koaRouter = require('koa-router');
let translator = require('./lib/translate');

let app = koa();
let router = koaRouter();

app.use(koaCors({ methods: 'GET' }));

app.use(function* pageNotFound(next) {
  yield next;

  if (this.status != 404) return;

  this.status = 404;
  this.body = 'Invalid request. Usage : /fromLang/toLang/Word. Example : /en/fr/london.';
});

router.get('/langs', function* listLangs() {
  this.body = require('./lib/translators/langs.json');
});

router.get('/:fromLang/:toLang/:input',
  function* log(next) {
    yield next;

    let count = _(this.body).values().flatten().size();

    console.log(`Found ${count} translations for "${this.params.input}" (${this.params.fromLang} -> ${this.params.toLang}).`);
  },
  function* translate() {
    try {
      this.body = yield translator(this.params.input, this.params.fromLang, this.params.toLang);
    }
    catch (err) {
      this.throw(400, err);
    }
  }
);

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app.listen(process.env.PORT || 3000);
