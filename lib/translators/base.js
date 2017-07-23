const debug = require('debug')
const qs = require('querystring')
const WikiAPI = require('../wiki')
const wikiLangs = require('./langs.json')

class BaseWikiTranslator {
  constructor (name, apiDomain) {
    this.name = name
    this.api = new WikiAPI(apiDomain)
    this.debug = debug(`wt:translator:${this.name}`)
  }

  translate (fromLang, toLang, input) {
    return Promise.all([
      this.checkLang(fromLang),
      this.checkLang(toLang)
    ])
    .then(() => {
      this.debug(`Translating "${input}" from "${fromLang}" to "${toLang}"`)

      return this._translate(fromLang, toLang, this.prepareInput(input))
      .then(translation => {
        this.debug(`Translated "${input}" (${fromLang}) to "${translation}" (${toLang}).`)
        return translation
      })
      .catch(() => {
        this.debug(`Could not fund translation for "${input}"`)
        return []
      })
    })
  }

  checkLang (lang) {
    return wikiLangs.includes(lang)
      ? Promise.resolve()
      : Promise.reject(new Error(`"${lang}" is not a valid language.`))
  }

  prepareInput (input) {
    return qs.unescape(input)
  }

  unavailable (fromLang, toLang, input) {
    throw new Error(`No translation available for "${input}" (${fromLang}) in ${toLang}. :-(`)
  }
}

module.exports = BaseWikiTranslator
