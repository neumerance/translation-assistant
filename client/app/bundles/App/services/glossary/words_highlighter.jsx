import { GlossaryPopup } from './glossary_popup';
import { WordsScanner } from './words_scanner';

export class WordsHighlighter {
  constructor (glossaries, iso = 'en') {
    this.iso = iso;
    this.glossaries = glossaries;
  };

  highlightWords (sourceString) {
    let result = sourceString;
    const replacedTagsResult = this.replaceTagsWithKeys(result);
    result = replacedTagsResult.html;
    result = this.insertPopovers (result);
    result = this.replaceKeysWithTags(result, replacedTagsResult.replacedTags);
    return result;
  };

  createPopupBuilder (glossary) {
    return (presentTerm) => {
      return new GlossaryPopup(glossary, presentTerm).buildHtml();
    };
  };

  insertPopovers (result) {
    const termPopups = {};
    const terms = [];

    this.glossaries.map((glossary) => {
      const term = glossary.term.toLowerCase();
      if (termPopups[term]) return;

      termPopups[term] = this.createPopupBuilder(glossary);
      terms.push(term);
    });

    if(terms.length == 0) return result;

    const fullTermsRegex = new WordsScanner().fullRegexp(terms, this.iso);

    result = result.replace(fullTermsRegex, (presentTerm) => {
      const builder = termPopups[presentTerm.toLowerCase()];
      return builder ? builder(presentTerm) : '';
    });
    return result;
  };

  replaceTagsWithKeys(html) {
    const tagRegExp = /<[^>]*>/gi;
    const tags = html.match(tagRegExp) || [];
    const replacedTags = [];

    for(let i = 0; i < tags.length; i++){
      const key = `{{tag_key_${i}}}`;
      const image = tags[i];
      html = html.replace(image, key);
      replacedTags.push([key,image]);
    }
    return { html: html, replacedTags: replacedTags };
  }

  replaceKeysWithTags(html, replacedTags) {
    for(let i = 0; i < replacedTags.length; i++){
      const key = replacedTags[i][0];
      const image = replacedTags[i][1];
      html = html.replace(key, image);
    }

    return html;
  }
}
