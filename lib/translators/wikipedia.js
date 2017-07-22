const BaseWikiTranslator = require('./base')

class WikipediaTranslator extends BaseWikiTranslator {
  constructor () {
    super('Wikipedia', 'wikipedia.org')
  }

  _translate (fromLang, toLang, input) {
    return this.api.langLinks(fromLang, input)
      .then((langLinks) => {
        const langLink = langLinks.find((langLink) => langLink.lang === toLang)

        if (!langLink) return this.unavailable(fromLang, toLang, input)

        return this.api.title(langLink.lang, langLink['*'])
      })
      .then((translation) => [translation])
  }
}

module.exports = WikipediaTranslator
