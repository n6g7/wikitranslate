'use strict';

let _ = require('lodash');
let Q = require('q');
let WikipediaTranslator = require('./translators/wikipedia');
let WiktionaryTranslator = require('./translators/wiktionary');

let translators = {
  wikipedia: new WikipediaTranslator(),
  wiktionary: new WiktionaryTranslator()
};

module.exports = (search, fromLang, toLang) => {
  let res = {};

  let promises = _.map(translators, (translator, name) => {
    return translator.translate(fromLang, toLang, search)
    .then((translations) => {
      res[name] = translations;
    });
  });

  return Q.all(promises).thenResolve(res);
};
