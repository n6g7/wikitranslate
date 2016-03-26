'use strict';

let expect = require('chai').expect;
let translate = require('../lib/translate');

describe('Translation', () => {
  it('should translate words', () => {
    return translate('Potentiel électrique', 'fr', 'en')
    .then((res) => {
      expect(res).to.be.an('object');
      expect(res).to.contain.keys('wikipedia');
      expect(res.wikipedia).to.be.an('array');
      expect(res.wikipedia[0]).to.equal('Electric potential');
    });
  });

  it('should return an error when no translation is available', () => {
    return translate('Pression électrostatique', 'fr', 'es')
    .then(() => {
      throw new Error('Did not return an error :(');
    }, (err) => {
      expect(err).to.contain('No translation available');
    });
  });

  it('should return an error when the destination language does not exist', () => {
    return translate('Ferromagnétisme', 'fr', 'jp')
    .then(() => {
      throw new Error('Did not return an error :(');
    }, (err) => {
      expect(err).to.contain('No translation available');
    });
  });

  it('should return an error when the origin language does not exist', () => {
    return translate('Ferromagnétisme', 'po', 'fr')
    .then(() => {
      throw new Error('Did not return an error :(');
    }, (err) => {
      expect(err).to.equal('Language "po" does not exist. :-(');
    });
  });
});
