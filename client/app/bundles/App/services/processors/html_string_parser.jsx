import * as _ from 'lodash';
import * as stringUtils from '../utils/string_utils';

export default class HtmlStringParser {

  constructor(translation='', colorData = {span: [], img: []}) {
    this.colorData = colorData;
    this.translation = stringUtils.cleanString(translation);
  }

  getColorData(elem) {
    const self = this;
    let result = null;
    const gid = elem.attr('id');
    const type = elem.prop('tagName').toLowerCase();
    self.colorData[type].map((color, idx) => {
      if (color.id == gid) result = color;
    });
    return result;
  }

  hasChildren(elem, selectors) {
    return !!elem.find(selectors).length;
  }

  discoverRanges(parent = null) {
    const self = this;
    const selectors = '> span, > img';
    let tagModel = [];
    if (!parent) return tagModel;
    parent.find(selectors).each(function(idx) {
      const elem = $(this);
      const translation = _.cloneDeep(self.translation);
      const colorData = self.getColorData(elem);
      const htmlString = elem[0].outerHTML;
      const type = elem.prop('tagName').toLowerCase();
      const translationParts = translation.split(htmlString);
      const left = stringUtils.stripHtmlTags(translationParts[0]).length;
      const inner = stringUtils.stripHtmlTags(translationParts[0] + htmlString).length;
      const right = stringUtils.stripHtmlTags(translationParts[1]).length;

      const start = left + (left ? 1 : 0);
      const end = (type == 'img') ? start : inner;
      tagModel.push({
        id: colorData.id,
        hex: colorData.hex,
        start: start,
        end: end,
        name: type,
        type: elem.attr('ctype'),
        addedAt: new Date().getTime()
      });
      if (!!self.hasChildren(elem, selectors)) tagModel = tagModel.concat(self.discoverRanges(elem));
    });
    return tagModel;
  }

  parseHtmlString() {
    const self = this;
    const parent = $('<div>').html(self.translation);
    return self.discoverRanges(parent);
  }

}