import * as stringUtils from './string_utils';
import * as _ from 'lodash';

export const hex = [
  '#b2df8a', '#ffff99', '#fb9a99', '#ffc287',
  '#a6cee3', '#1f78b4', '#78de71', '#c33c3e',
  '#fdbf6f', '#cab2d6', '#9173b1', '#db936b',
  '#fbb4ae', '#b3cde3', '#ccebc5', '#e695ff',
  '#fed9a6', '#ffffcc', '#e5d8bd', '#fddaec'
];

export const getColorByGid = (gid, colors) => {
  let hex = null
  $.each(colors, function (id, color) {
    if (gid == color.id) {
      hex = color.hex
    }
  })
  return hex
}

export const getTagNameByGid = function (gid, colors) {
  let name = null
  $.each(colors, function (id, color) {
    if (gid == color.id) {
      name = color.ctype
    }
  });
  if (!name) return '';
  const arr = name.split('-');
  return arr[arr.length - 1];
}

export class ColorBuilder {

  constructor(string = '') {
    this.string = stringUtils.cleanString(string);
  }

  makeColorByString(elements = 'g, x', invertColorArray = false) {
    const self = this;
    const wrapper = $('<div>').html(self.string);
    let colorArray = _.cloneDeep(hex);
    if (invertColorArray) colorArray = _.reverse(colorArray);
    if (wrapper.find(elements).length > colorArray.length) {
      throw new Error('Color count is out of bounce.');
    }
    return colorArray.slice(0, wrapper.find(elements).length);
  }

  gTagColorSelection(applied = false, invertColorArray = false) {
    const self = this;
    let colors = [];
    if (self.string.length) {
      const wrapper = $('<div>').html(self.string);
      const colorArray = self.makeColorByString('g', invertColorArray);
      wrapper.find('g').each(function (idx) {
        colors.push({
          id: $(this).attr('id'),
          hex: colorArray[idx],
          isSet: applied,
          ctype: $(this).attr('ctype')
        });
      });
    }
    return colors;
  }

  xTagColorSelection(){
    const self = this;
    const result = [];
    const colorArray = _.reverse(self.makeColorByString('g, x', true));
    const wrapper = $('<div>').html(self.string);
    wrapper.find('x').each(function (idx) {
      result.push({
        id: $(this).attr('id'),
        type: $(this).attr('ctype'),
        hex: colorArray[idx],
        isSet: true
      });
    });
    return result;
  }

}