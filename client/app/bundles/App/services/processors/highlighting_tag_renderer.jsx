import * as _ from 'lodash';
import * as stringUtils from '../utils/string_utils';
import {MrkTooltips} from '../processors/mrk_tooltips';

export const applyTags = (text, tagModel) => {
  let result = text;
  const model = tagModel;
  recalculateNestedLevels(model.tags);

  while (model.tags.length > 0) {
    const tag = fetchLowestTag(model.tags);
    result = applyTag(result, tag, model);
  }
  const $html = $(`<root>${result}</root>`);
  result = (new MrkTooltips().build($html));
  return result.html();
};

var applyTag = (text, tag, tagModel) => {
  const left = text.slice(0, tag.start);
  const inner = text.slice(tag.start, tag.end);
  const right = text.slice(tag.end, text.legnth);

  const taggedInner = tag.name == 'img' ? buildImgTag(tag) : buildSpanTag(tag, inner);
  const result = left + taggedInner + right;

  const diffLength = taggedInner.length - inner.length;
  const endIndex = tag.end;

  _.remove(tagModel.tags, tag);
  shiftIndexes(endIndex, diffLength, tagModel);

  return result;
};

var buildSpanTag = (tag, text) =>
  `<${tag.name} id="${tag.id}" class="xtag highlight-text" title="${tag.realTag}" style="background: ${tag.hex}">${text}</${tag.name}>`;

var buildImgTag = (tag) =>
  `&#x2063;<${tag.name} src="${stringUtils.generateTextImage(tag.type)}" title="${tag.realTag || 'image'}" ctype="${tag.type}" id="${tag.id}" class="xtag" style="background: ${tag.hex}" />&#x2063;`;

var shiftIndexes = (endIndex, diffLength, tagModel) => {
  for (const t of tagModel.tags) {
    if (t.start >= endIndex) {
      t.start = t.start + diffLength;
    }
    if (t.end >= endIndex) {
      t.end = t.end + diffLength;
    }
  }
};

var recalculateNestedLevels = tags => {
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    tag.level = 0;

    for (let j = 0; j < tags.length; j++) {
      const chtag = tags[j];

      if (i == j) continue;
      if (chtag.start == tag.start && chtag.end == tag.end) continue;
      if (tag.start <= chtag.start && tag.end >= chtag.end) tag.level++;
    }
  }
};

var fetchLowestTag = tags => {
  return (tags.sort((a, b) => {
    return (a.level != b.level) ? (a.level - b.level) : (a.addedAt - b.addedAt)
  })[0]);
};