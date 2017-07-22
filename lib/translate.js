const WikipediaTranslator = require('./translators/wikipedia')
const WiktionaryTranslator = require('./translators/wiktionary')

const translators = {
  wikipedia: new WikipediaTranslator(),
  wiktionary: new WiktionaryTranslator()
}

module.exports = (search, fromLang, toLang) => {
  const res = {}
  const promises = []

  for (let key in translators) {
    const translator = translators[key]

    promises.push(translator.translate(fromLang, toLang, search)
      .then(translations => {
        res[key] = translations
      }))
  }

  return Promise.all(promises)
    .then(() => res)
}

module.exports.langs = require('./translators/langs.json')
