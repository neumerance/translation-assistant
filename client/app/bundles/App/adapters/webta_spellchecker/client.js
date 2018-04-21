import axios from 'axios';
import WebtaSpellcheckerUserDictionary from './user_dictionary';
import * as _ from "lodash";

const nullFunc = () => {};


export default class WebtaSpellcheckerClient {
  constructor(lang) {
    this.lang = lang;
    this.userDictionary = new WebtaSpellcheckerUserDictionary(lang);
  }

  spellcheck(sentence, callback = nullFunc) {
    this.request(sentence, (response) => {
      const data = this.removeWhitelistedWords(response.data);
      callback(data);
    });
  }

  removeWhitelistedWords(data) {
    const dictionary = this.userDictionary.getDictionary();
    const whitelistedWordKeys = [];
    const cleanedData = data;
    _.forEach(dictionary, (word, key) => {
      const index = _.findIndex(cleanedData, (datum) => { datum.word.toLowerCase() === word.toLowerCase() });
      if (index) { whitelistedWordKeys.push(key) }
    });
    _.pullAt(cleanedData, whitelistedWordKeys);
    return cleanedData;
  }

  request(sentence, callback = nullFunc) {
    axios.post('/webta-spellchecker/spellcheck', {
      lang: this.lang,
      sentence: sentence
    })
    .then(function (response) {
      if (response.data) { callback(response.data); }
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}