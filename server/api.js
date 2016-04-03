'use strict';

let _ = require('lodash');
let koaRouter = require('koa-router');
let translator = require('../lib/translate');

let router = koaRouter();

router.get('/langs', function* listLangs() {
  this.body = require('../lib/translators/langs.json');
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

module.exports = router;
