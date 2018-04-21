import * as _ from 'lodash';

export default class WebtaSpellcheckerUserDictionary {
  constructor(lang) {
    this.dictionaryName = `dictionaries_${lang}`;
  }

  getDictionary() {
    const storedData = JSON.parse(localStorage.getItem(this.dictionaryName));
    if (!storedData) return [];
    return storedData.data;
  }

  addToDictionary(word) {
    const dictionary = this.getDictionary();
    if (!_.find(dictionary, (x) => { return x.toLowerCase() === word.toLowerCase() })) {
      dictionary.push(word.toLowerCase());
      this.saveToLocalStorage(dictionary);
    }
  }

  removeFromDictionary(word) {
    const dictionary = this.getDictionary();
    const index = _.findIndex(dictionary, (x) => { return x.toLowerCase() === word.toLowerCase() });
    _.pullAt(dictionary, [index]);
    console.log('dictionary', dictionary);
    this.saveToLocalStorage(dictionary);
  }

  saveToLocalStorage(data) {
    if (Array.isArray(data)) {
      localStorage.setItem(this.dictionaryName, JSON.stringify({data: data}));
    }
  }
}