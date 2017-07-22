const debug = require('debug')('wt:wiki')
const request = require('request')
const urlFormat = require('url')
const Q = require('q')

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

    return Q.nfcall(request, url, { json: true })
      .get(1)
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
    .get('parse')
  }

  page (lang, page) {
    return this._parse(lang, page)
  }

  title (lang, page) {
    return this._parse(lang, page, ['displaytitle']).get('displaytitle')
  }

  langLinks (lang, page) {
    return this._parse(lang, page, ['langlinks']).get('langlinks')
  }

  interWikiLinks (lang, page) {
    return this._parse(lang, page, ['iwlinks']).get('iwlinks')
  }
}

module.exports = MediaWikiAPI
