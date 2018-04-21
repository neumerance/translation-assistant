import axios from 'axios';
import * as _ from 'lodash';

export default class LanguageMappings {
  constructor() {
    this.languageLists = JSON.parse(LANGUAGE_MAPPINGS);
  }

  getLanguageByIso(language) {
    return _.find(this.languageLists, (x) => {
      return x['icl_format_iso'] === language || x['wpml_iso_format'] === language
    })
  }

  isMachineTranslationSupported(language) {
    const result = _.get(this.getLanguageByIso(language), 'ms_format_iso', null);
    return !!result;
  }

  isSpellCheckerSupported(language) {
    return !!_.get(this.getLanguageByIso(language), 'spellcheck_iso_format', null);
  }

  async request() {
    return await axios.get('/language/mappings')
  }
}
