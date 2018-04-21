import * as _ from 'lodash';

export default class WebtaSpellcheckerController {

  constructor(data = []) {
    this.data = data;
    this.processedWords = [];
    this.currentWord = data[0];
  }

  getWords() {
    const data = this.data;
    _.pullAllBy(data, this.processedWords, 'word');
    return data;
  }

  getSuggestedWords() {
    const current = this.currentWord;
    if (!current) return [];
    return current.suggestions;
  }

  getCurrentWord() {
    if (!this.currentWord) return null;
    return this.currentWord.word;
  }

  processWord(datum = {}) {
    const processedWords = this.processedWords;

    console.log('processedWords', processedWords);
    // processedWords.push(datum ? datum : this.currentWord);
    // this.processedWords = processedWords;
    // this.setNextCurrentWord();
  }

  setCurrentWord(datum = {}) {
    this.currentWord = datum;
    console.log('this.currentWord', this.currentWord);
  }

  setNextCurrentWord() {
    if (this.currentWord) {
      const index = _.find(this.data, (x) => { this.currentWord.word.toLowerCase() === x.word.toLowerCase() })
      if (index && this.data[index + 1]) { this.currentWord = this.data[index + 1] }
    }
  }

}