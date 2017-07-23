const debug = require('debug')('wt:wiki')
const fetch = require('node-fetch')
const urlFormat = require('url')

class MediaWikiAPI {
  constructor (domain) {
    this.domain = domain
  }

  _request (lang, query) {
    query = Object.assign(query, {
      format: 'json'
    })

    const queryString = urlFormat.format({ query })
    const url = `https://${lang}.${this.domain}/w/api.php${queryString}`

    debug('Requesting %s ...', url)

    return fetch(url)
      .then(res => res.json())
      .catch(() => {
        throw new Error(`Language "${lang}" does not exist. :-(`)
      })
  }

  _parse (lang, page, props) {
    return this._request(lang, {
      action: 'parse',
      page,
      prop: props.join('|')
    })
    .then(res => res.parse)
  }

  page (lang, page) {
    return this._parse(lang, page)
  }

  title (lang, page) {
    return this._parse(lang, page, ['displaytitle'])
      .then(res => res.displaytitle)
  }

  langLinks (lang, page) {
    return this._parse(lang, page, ['langlinks'])
      .then(res => res.langlinks)
  }

  interWikiLinks (lang, page) {
    return this._parse(lang, page, ['iwlinks'])
      .then(res => res.iwlinks)
  }
}

module.exports = MediaWikiAPI
