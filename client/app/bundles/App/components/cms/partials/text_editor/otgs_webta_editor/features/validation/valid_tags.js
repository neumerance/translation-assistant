import * as _ from 'lodash';

const OPTIONAL_TAGS = ['sup'];

export class ValidTags {
  data(originalElem, translated){
    let filterTags = (e)=>{ return (OPTIONAL_TAGS.indexOf(e.tag) === -1) };
    let filterTagByName = (tag)=>{ return (OPTIONAL_TAGS.indexOf(tag) === -1) };

    let originalTags = originalElem.find('*').toArray().map((e)=>{
      const $element = $(e);
      const tag = ($element)=>{ return $element.attr('ctype').toString().split('x-html-').pop() };
      const path = [];
      let $parent = $element;
      while(($parent[0].tagName.toLowerCase() !== 'div')) {
        path.push(tag($parent));
        $parent  = $parent.parent();
      }

      return { tag: tag($element), element: $element, path: path.filter(filterTagByName).join(' > ') };
    });

    let translatedTags = translated.find('span, img').toArray().map((e)=>{
      const $element = $(e);

      const tag = ($element) => {
        let title = $element.attr('title') || $element.attr('data-original-title');
        const p = title.split(', ');
        return p[p.length -1];
      };

      const path = [];
      let $parent = $element;
      while(($parent[0].tagName.toLowerCase() !== 'div')) {
        path.push(tag($parent));
        $parent  = $parent.parent();
      }

      return { tag: tag($element), element: $element, path: path.filter(filterTagByName).join(' > ') };
    });

    originalTags = originalTags.filter(filterTags);
    translatedTags = translatedTags.filter(filterTags);
    _.sortBy(originalTags, o => [o.tag, o.path]);
    _.sortBy(translatedTags, o => [o.tag, o.path]);

    return { originalTags: originalTags, translatedTags: translatedTags }
  }
}
