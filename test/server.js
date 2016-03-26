'use strict';

let chai = require('chai');
let server = require('../server');

chai.use(require('chai-http'));

let expect = chai.expect;

describe('API', () => {
  // Wikipedia API is somtimes a bit picky.
  this.timeout = 5000;

  it('should translate words', () => {
    return chai.request(server)
    .get('/fr/en/Potentiel électrique')
    .then((res) => {
      expect(res).to.have.status(200);
      expect(res.text).to.equal('Electric potential');
    });
  });

  it('should refuse malformed urls', () => {
    return chai.request(server)
    .get('/fr/Aimantation')
    .then(() => {
      throw new Error('Did not return an error :(');
    }, (err) => {
      expect(err).to.have.status(404);
      expect(err.response.text).to.contain('Usage');
    });
  });

  it('should return an error when no translation is available', () => {
    return chai.request(server)
    .get('/fr/es/Pression électrostatique')
    .then(() => {
      throw new Error('Did not return an error :(');
    }, (err) => {
      expect(err).to.have.status(404);
      expect(err.response.text).to.contain('No translation available');
    });
  });

  it('should return an error when the destination language does not exist', () => {
    return chai.request(server)
    .get('/fr/jp/Ferromagnétisme')
    .then(() => {
      throw new Error('Did not return an error :(');
    }, (err) => {
      expect(err).to.have.status(404);
      expect(err.response.text).to.contain('No translation available');
    });
  });

  it('should return an error when the origin language does not exist', () => {
    return chai.request(server)
    .get('/po/fr/Ferromagnétisme')
    .then(() => {
      throw new Error('Did not return an error :(');
    }, (err) => {
      expect(err).to.have.status(404);
      expect(err.response.text).to.equal('Language "po" does not exist. :-(');
    });
  });
});
