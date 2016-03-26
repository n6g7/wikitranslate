'use strict';

let _ = require('lodash');
let BaseWikiTranslator = require('./base');

class WikipediaTranslator extends BaseWikiTranslator
{
  constructor() {
    super('Wikipedia', 'wikipedia.org');
  }

  _translate(fromLang, toLang, input) {
    return this.api.langLinks(fromLang, input)
    .then((langLinks) => {
      let langLink = _.find(langLinks, (langLink) => langLink.lang === toLang);

      if (!langLink) return this.unavailable(fromLang, toLang, input);

      return this.api.title(langLink.lang, langLink['*']);
    })
		.then((translation) => [translation]);
  }
}

module.exports = WikipediaTranslator;
