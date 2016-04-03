import langs from '../lib/translators/langs.json';

class WTController {
  constructor($http) {
    this.$http = $http;

    this.fromLang;
    this.toLang;
    this.input;
    this.languages = langs;

    this.translating = false;
  }

  translate() {
    this.$http.get(`/api/${this.fromLang}/${this.toLang}/${this.input}`)
    .then((res) => {
      let translations = _.reduce(res.data, (result, t) => {
        return result.concat(t);
      }, []);

      this.result = translations.join(', ');
      this.translating = false;
    });

    this.translating = true;
  }
}

WTController.$inject = ['$http'];

export default WTController;
