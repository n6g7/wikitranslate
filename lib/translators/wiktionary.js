'use strict';

let _ = require('lodash');
let BaseWikiTranslator = require('./base');
let Q = require('q');

class WiktionaryTranslator extends BaseWikiTranslator
{
  constructor() {
    super('Wiktionary', 'wiktionary.org');
  }

  _translate(fromLang, toLang, input) {
    return this.api.interWikiLinks(fromLang, input)
    .then((interWikiLinks) => {
      return _.filter(interWikiLinks, (iwLink) => {
        return iwLink.prefix === toLang;
      });
    })
    .then((iwLinks) => {
      let promises = _.map(iwLinks, (iwLink) => {
        let pageName = iwLink['*'].split(':').splice(1).join(':');

        return this.api.title(iwLink.prefix, pageName);
      });

      return Q.all(promises);
    });
  }

  prepareInput(input) {
    return super.prepareInput(input).toLowerCase();
  }
}

module.exports = WiktionaryTranslator;
