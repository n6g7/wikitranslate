const expect = require('chai').expect;
const translate = require('../lib/translate');

describe('Translation', function() {
  this.timeout(5000);

  it('should translate words', () => {
    return translate('Potentiel électrique', 'fr', 'en')
    .then((res) => {
      expect(res).to.be.an('object');
      expect(res).to.contain.keys('wikipedia');
      expect(res.wikipedia).to.be.an('array');
      expect(res.wikipedia[0]).to.equal('Electric potential');
    });
  });

  it('should return an error when the destination language does not exist', () => {
    return translate('Ferromagnétisme', 'fr', 'jp')
    .then(() => {
      throw new Error('Did not return an error :(');
    }, (err) => {
      expect(err).to.contain('"jp" is not a valid language.');
    });
  });

  it('should return an error when the origin language does not exist', () => {
    return translate('Ferromagnétisme', 'po', 'fr')
    .then(() => {
      throw new Error('Did not return an error :(');
    }, (err) => {
      expect(err).to.equal('"po" is not a valid language.');
    });
  });

  it('should provide a list of supported languages', () => {
    expect(translate).to.contain.key('langs');
    expect(translate.langs).to.be.an('array');
  });
});
