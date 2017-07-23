jest.mock('../wiki', () => {
  const api = 'jdqqskd'
  const WikiAPI = jest.fn(() => api)
  WikiAPI.api = api
  return WikiAPI
})

const BaseWikiTranslator = require('./base')
const WikiAPI = require('../wiki')

describe('BaseWikiTranslator', () => {
  const name = 'kqslpdkqlsd'
  const apiDomain = 'kqlmdsq'
  let translator

  beforeEach(() => {
    WikiAPI.mockClear()
    translator = new BaseWikiTranslator(name, apiDomain)
  })

  describe('constructor', () => {
    it('sets translator properties', () => {
      expect(translator).toHaveProperty('name', name)
      expect(translator).toHaveProperty('api')
      expect(translator).toHaveProperty('debug')
    })

    it('instanciates a new api client', () => {
      expect(WikiAPI).toHaveBeenCalledTimes(1)
      expect(WikiAPI.mock.calls[0]).toEqual([apiDomain])
    })
  })

  describe('translate', () => {
    const fromLang = 'fr'
    const toLang = 'en'
    const input = 'lkqdlq'
    const translation = 'kqsdk'
    const preparedInput = 'klqsdkq'

    beforeEach(() => {
      translator._translate = jest.fn(
        () => Promise.resolve(translation)
      )
      translator.prepareInput = jest.fn(() => preparedInput)
    })

    it('returns a promise', () => {
      expect(translator.translate(fromLang, toLang, input)).toBeInstanceOf(Promise)
    })

    it('rejects if one of the languages is not supported', async () => {
      let promise = translator.translate('nope', toLang, input)
      await expect(promise).rejects.toHaveProperty('message', '"nope" is not a valid language.')

      promise = translator.translate(fromLang, 'hey', input)
      await expect(promise).rejects.toHaveProperty('message', '"hey" is not a valid language.')
    })

    it('calls the _translate method', async () => {
      await translator.translate(fromLang, toLang, input)

      expect(translator.prepareInput).toHaveBeenCalledTimes(1)
      expect(translator.prepareInput.mock.calls[0]).toEqual([input])

      expect(translator._translate).toHaveBeenCalledTimes(1)
      expect(translator._translate.mock.calls[0]).toEqual([
        fromLang,
        toLang,
        preparedInput
      ])
    })

    it('resolves to the translation', async () => {
      const result = await translator.translate(fromLang, toLang, input)

      expect(result).toBe(translation)
    })
  })
})
