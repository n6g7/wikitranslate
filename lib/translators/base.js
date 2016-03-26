'use strict';

let _ = require('lodash');
let debug = require('debug');
let Q = require('q');
let qs = require('querystring');
let WikiAPI = require('../wiki');
let wikiLangs = require('./langs.json');

class BaseWikiTranslator
{
  constructor(name, apiDomain) {
    this.name = name;
    this.api = new WikiAPI(apiDomain);
    this.debug = debug(`wt:translator:${this.name}`);
  }

  translate(fromLang, toLang, input) {
    return Q()
    .then(() => this.checkLang(fromLang))
    .then(() => this.checkLang(toLang))
    .tap(() => {
      this.debug('Translating "%s" (%s -> %s) ...', input, fromLang, toLang);
    })
    .then(() => {
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
        return [];
      });
    });
  }

  checkLang(lang) {
    if (!_.includes(wikiLangs, lang)) return Q.reject(`"${lang}" is not a valid language.`);
  }

  prepareInput(input) {
    return qs.unescape(input);
  }

  unavailable(fromLang, toLang, input) {
    throw `No translation available for "${input}" (${fromLang}) in ${toLang}. :-(`;
  }
}

module.exports = BaseWikiTranslator;
