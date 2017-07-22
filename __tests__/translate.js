const translate = require('../lib/translate')

describe('Translation', function () {
  it('should translate words', () => {
    return translate('Potentiel électrique', 'fr', 'en')
    .then((res) => {
      expect(res).toBeInstanceOf(Object)
      expect(res).toHaveProperty('wikipedia')
      expect(res.wikipedia).toBeInstanceOf(Array)
      expect(res.wikipedia[0]).toBe('Electric potential')
    })
  })

  it('should return an error when the destination language does not exist', () => {
    return translate('Ferromagnétisme', 'fr', 'jp')
    .then(() => {
      throw new Error('Did not return an error :(')
    }, (err) => {
      expect(err.message).toBe('"jp" is not a valid language.')
    })
  })

  it('should return an error when the origin language does not exist', () => {
    return translate('Ferromagnétisme', 'po', 'fr')
    .then(() => {
      throw new Error('Did not return an error :(')
    }, (err) => {
      expect(err.message).toBe('"po" is not a valid language.')
    })
  })

  it('should provide a list of supported languages', () => {
    expect(translate).toHaveProperty('langs')
    expect(translate.langs).toBeInstanceOf(Array)
  })
})
