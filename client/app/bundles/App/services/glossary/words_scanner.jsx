import escapeStringRegexp from 'escape-string-regexp';

export class WordsScanner {

  buildRegexpStr(word) {
    return `\\b(${escapeStringRegexp(word)})\\b`
  };

  buildNotWordSensitiveRegexpStr(string) {
    return escapeStringRegexp(string);
  }

  stringRegexp(string) {
    return new RegExp(this.buildNotWordSensitiveRegexpStr(string), 'gi')
  }

  fullRegexp(words, iso = 'en') {
    const self = this;
    let action = self.buildRegexpStr;
    if (iso == 'he') action = self.buildNotWordSensitiveRegexpStr;
    return new RegExp(words.map (
        (term) => { return action(term) }).join('|')
      , 'gi'
    );
  }
}
