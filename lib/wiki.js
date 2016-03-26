'use strict';

let _ = require('lodash');
let debug = require('debug')('wt:wiki');
let request = require('request');
let urlFormat = require('url');
let Q = require('q');

class MediaWikiAPI {
  constructor(domain) {
    this.domain = domain;
  }

  _request(lang, query) {
    query = _.defaults(query, {
      format: 'json'
    });
    let queryString = urlFormat.format({ query });
    let url = `https://${lang}.${this.domain}/w/api.php${queryString}`;

    debug('Requesting %s ...', url);

    return Q.nfcall(request, url, { json: true }).get(1)
    .catch(() => {
      throw `Language "${lang}" does not exist. :-(`;
    });
  }

  _parse(lang, page, props) {
    return this._request(lang, {
      action: 'parse',
      page,
      prop: props.join('|')
    })
    .get('parse');
  }

  page(lang, page) {
    return this._parse(lang, page);
  }

  title(lang, page) {
    return this._parse(lang, page, ['displaytitle']).get('displaytitle');
  }

  langLinks(lang, page) {
    return this._parse(lang, page, ['langlinks']).get('langlinks');
  }
}

module.exports = MediaWikiAPI;
