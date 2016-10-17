
const BaseWikiTranslator = require('./base');

class WiktionaryTranslator extends BaseWikiTranslator
{
  constructor() {
    super('Wiktionary', 'wiktionary.org');
  }

  _translate(fromLang, toLang, input) {
    return this.api.interWikiLinks(fromLang, input)
    .then((interWikiLinks) => {
      const promises = interWikiLinks
        .filter(iwLink => iwLink.prefix === toLang)
        .map(iwLink => {
          const pageName = iwLink['*'].split(':').splice(1).join(':');

          return this.api.title(iwLink.prefix, pageName);
        });

      return Promise.all(promises);
    });
  }

  prepareInput(input) {
    return super.prepareInput(input).toLowerCase();
  }
}

module.exports = WiktionaryTranslator;
