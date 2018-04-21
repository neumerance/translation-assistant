const SYMBOL = '&#9679;';
const RENDERED_SYMBOL = '●';
const SPACE = ' ';
const ENTITY_SPACE = '&nbsp;';
const MASK = '{{{wpml_space_mask}}}';

export const OtgsWebtaEditorVisibleSpace = {
  symbol: SYMBOL,
  renderedSymbol: RENDERED_SYMBOL,
  convertTextToVisibleSpaces: (text)=> {
    return OtgsWebtaEditorVisibleSpace.replace(text, SPACE, SYMBOL);
  },

  replace: (text, base, replacement)=> {
    return text.replace(new RegExp(base, 'g'), replacement);
  },

  convertElementToVisibleSpaces: (content) => {
    const $element = $('<div>').html(content);
    const elements = $element.find('*').toArray();

    const nodeFilter = (e)=>{ return e.nodeType === Node.TEXT_NODE };
    const textNodes = $element.contents().toArray().filter(nodeFilter);


    for(let i=0; i < elements.length; i++) {
      const elementTextNodes = $(elements[i]).contents().toArray().filter(nodeFilter);

      for(let j=0; j < elementTextNodes.length; j++) {
        textNodes.push(elementTextNodes[j]);
      }
    }

    for(let i=0; i < textNodes.length; i++) {
      if (textNodes[i]) {
        textNodes[i].textContent = OtgsWebtaEditorVisibleSpace.replace(textNodes[i].textContent, SPACE, MASK);
      }
    }
    let result = OtgsWebtaEditorVisibleSpace.replace($element.html(), MASK, SYMBOL);
    result = OtgsWebtaEditorVisibleSpace.replace(result, ENTITY_SPACE, SYMBOL);
    return result;
  },

  convertBack: (text)=> {
    return OtgsWebtaEditorVisibleSpace.replace(text, RENDERED_SYMBOL, SPACE);
  }
};
