'use strict';

let _ = require('lodash');
let debug = require('debug')('wt:wiki');
let request = require('request');
let urlFormat = require('url');
let Q = require('q');

let Wikipedia = module.exports = (lang, query) => {
  query = _.defaults(query, {
    format: 'json'
  });
  let queryString = urlFormat.format({ query });
  let url = `http://${lang}.wikipedia.org/w/api.php${queryString}`;

  debug('Requesting %s ...', url);

  return Q.nfcall(request, url, { json: true }).get(1)
  .catch(() => {
    throw `Language "${lang}" does not exist. :-(`;
  });
};

// https://en.wikipedia.org/w/api.php?action=help&modules=parse
Wikipedia._parse = (lang, page, props) => {
  return Wikipedia(lang, {
    action: 'parse',
    page,
    prop: props.join('|')
  })
  .get('parse');
};

Wikipedia.page = (lang, page) => {
  return Wikipedia._parse(lang, page);
};

Wikipedia.title = (lang, page) => {
  return Wikipedia._parse(lang, page, ['displaytitle'])
	.get('displaytitle');
};

Wikipedia.langLinks = (lang, page) => {
  return Wikipedia._parse(lang, page, ['langlinks'])
  .get('langlinks');
};
