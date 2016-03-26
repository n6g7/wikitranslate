'use strict';

let _ = require('lodash');
let debug = require('debug')('wt:translate');
let qs = require('querystring');
let wiki = require('./wiki');

module.exports = (search, fromLang, toLang) => {
  search = qs.unescape(search);

  debug('Translating "%s" (%s -> %s) ...', search, fromLang, toLang);

  return wiki.langLinks(fromLang, search)
  .then((langLinks) => {
    let langLink = _.find(langLinks, (langLink) => {
      return langLink.lang === toLang;
    });

    if (!langLink) throw `No translation available for "${search}" (${fromLang}) in ${toLang}. :-(`;

    return wiki.title(langLink.lang, langLink['*'])
    .tap((translation) => debug('Translated "%s" (%s) to "%s" (%s).', search, fromLang, translation, toLang));
  })
  .catch((err) => {
    debug(err);
    throw err;
  });
};
