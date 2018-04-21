import {SpellCheckRequest} from '../../constants/request';
import * as stringUtils from '../utils/string_utils';
import {OtgsWebtaEditorVisibleSpace} from '../../components/cms/partials/text_editor/otgs_webta_editor/editor/visible_space';
import * as _ from 'lodash';

const request = new SpellCheckRequest();
const store = localStorage;

export default class SpellCheckApiRequest {

  dispatch(params, callback = (response) => {}) {
    request.post('/SpellChecker.php', params, (response) => {
      callback(response);
    }, false);
  }

  filterByLocalDictionary(languageName = '', sentence = '') {
    const dictionaryName = `dictionaries_${languageName}`
    const dictionaries = store[dictionaryName] ? JSON.parse(store[dictionaryName]).data : [];
    const sentenceArray = stringUtils.removePunctuations(sentence.toLowerCase()).split(' ');
    _.pullAll(sentenceArray, dictionaries);
    const result = sentenceArray.join(' ');
    return result;
  }
  
  generateFormData(data) {
    const params = new FormData();
    params.append('driver', 'pspell');
    _.forOwn(data, (value, key) => {
      params.append(key, value);
    });
    return params;
  }

  spellCheckSentence(targetLanguage, sentence, callback = (data) => {}) {
    const self = this;
    let result = [];
    const cleanedString = stringUtils.stripHtmlEntities(sentence);
    let textToCheck = self.filterByLocalDictionary(_.get(targetLanguage, 'name', ''), cleanedString);
    textToCheck = OtgsWebtaEditorVisibleSpace.convertBack(textToCheck);
    const params = {
      lang: _.get(targetLanguage, 'iso', 'en'),
      action: 'get_incorrect_words',
      'text[]': textToCheck
    }
    if (textToCheck.length) {
      const formData = self.generateFormData(params);
      self.dispatch(formData, (response) => {
        if (response.data) {
          if (response.data.outcome == 'success') result = response.data.data[0];
        }
        callback(result);
      });
    } else {
      callback(result);
    }
  }

  spellCheckWordSuggestions(langIso, word, callback = (data) => {}) {
    const self = this;
    const suggestionsLimit = 8;
    let data = [];
    const params = {
      lang: langIso,
      action: 'get_suggestions',
      'word': word
    }
    const formData = self.generateFormData(params);
    self.dispatch(formData, (response) => {
      if (response.data) data = (response.data || []).slice(0, suggestionsLimit);
      callback(data);
    });
  }

}