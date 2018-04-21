import {WordsScanner} from './words_scanner';

export class GlossaryFilter {
  filterOutGlossaries(glossaries, originalString, cmsData) {
    const self = this;
    const iso = _.get(cmsData, 'source_language.iso', 'en');
    const result = [];

    const toLowerTerm = (item) => {
      return item.term.toLowerCase()
    };
    const toLowerWord = (word) => {
      return word.toLowerCase()
    };

    const projectTerms = glossaries.map(toLowerTerm);
    const fullTermsRegex = new WordsScanner().fullRegexp(projectTerms, iso);
    const presentTerms = (originalString.match(fullTermsRegex) || []).map(toLowerWord);

    glossaries.map((glossary, _idx) => {
      if (_.includes(presentTerms, glossary.term.toLowerCase())) {
        result.push(glossary);
      }
    });
    return result
  }
}
