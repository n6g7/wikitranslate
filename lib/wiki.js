const debug = require('debug')('wt:wiki')
const fetch = require('node-fetch')
const url = require('url')

class MediaWikiAPI {
  constructor (domain) {
    this.domain = domain
  }

  request (lang, query) {
    query = Object.assign(
      { format: 'json' },
      query
    )

    const queryString = url.format({ query })
    const wikiUrl = `https://${lang}.${this.domain}/w/api.php${queryString}`

    debug(`Requesting ${wikiUrl}`)

    return fetch(wikiUrl)
      .then(res => res.json())
      .catch(() => {
        throw new Error(`Language "${lang}" does not exist`)
      })
  }

  parse (lang, page, props=[]) {
    return this.request(lang, {
      action: 'parse',
      page,
      prop: props.join('|')
    })
    .then(res => res.parse)
  }

  page (lang, page) {
    return this.parse(lang, page)
  }

  title (lang, page) {
    return this.parse(lang, page, ['displaytitle'])
      .then(res => res.displaytitle)
  }

  langLinks (lang, page) {
    return this.parse(lang, page, ['langlinks'])
      .then(res => res.langlinks)
  }

  interWikiLinks (lang, page) {
    return this.parse(lang, page, ['iwlinks'])
      .then(res => res.iwlinks)
  }
}

module.exports = MediaWikiAPI
