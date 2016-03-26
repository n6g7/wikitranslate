'use strict';

let debug = require('debug');
let qs = require('querystring');
let WikiAPI = require('../wiki');

class BaseWikiTranslator
{
  constructor(name, apiDomain) {
    this.name = name;
    this.api = new WikiAPI(apiDomain);
    this.debug = debug(`wt:translator:${this.name}`);
  }

  translate(fromLang, toLang, input) {
    this.debug('Translating "%s" (%s -> %s) ...', input, fromLang, toLang);

    return this._translate(
      fromLang,
      toLang,
      this.prepareInput(input)
    )
    .tap((translation) => {
      this.debug('Translated "%s" (%s) to "%s" (%s).', input, fromLang, translation, toLang);
    })
    .catch((err) => {
      this.debug(err);
      throw err;
    });
  }

  prepareInput(input) {
    return qs.unescape(input);
  }

  unavailable(fromLang, toLang, input) {
    throw `No translation available for "${input}" (${fromLang}) in ${toLang}. :-(`;
  }
}

module.exports = BaseWikiTranslator;
