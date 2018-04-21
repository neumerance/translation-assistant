import {generateTextImage} from "../services/utils/app_constants";

export const hex = ['#b2df8a', '#ffff99', '#fb9a99', '#ff7f00', '#a6cee3', '#1f78b4', '#33a02c', '#e31a1c', '#fdbf6f', '#cab2d6', '#6a3d9a', '#b15928']
import * as _ from 'lodash';

export const makeColorByString = function (string, elements, invertColorArray = false) {
  const wrapper = $('<div>').html(string)
  let colorArray = _.cloneDeep(hex);
  if (invertColorArray) colorArray = _.reverse(colorArray);
  if (wrapper.find(elements).length > colorArray.length) {
    throw new Error('Color count is out of bounce.')
  }
  return colorArray.slice(0, wrapper.find(elements).length)
}


export const cleanString = function (string) {
  return string.replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/ +(?= )/g, '').trim()
    .replace(/&[^\s].*?;/g, '')
    .replace(/<br>/g, '')
    .replace(/<hr>/g, '')
    .replace(/<br\/>/g, '')
    .replace(/<hr\/>/g, '')
    .replace(/<br \/>/g, '')
    .replace(/<hr \/>/g, '')
    .replace(/<>/g, '')
}

export const colorSelection = function (string, elements, applied = false, invertColorArray = false) {
  let colors = []
  if (string) {
    const cleanstring = cleanString(string)
    const wrapper = $('<div>').html(cleanstring)
    const colorArray = makeColorByString(cleanstring, elements, invertColorArray)
    wrapper.find(elements).each(function (idx) {
      colors.push({
        id: $(this).attr('id'),
        hex: colorArray[idx],
        isSet: applied,
        ctype: $(this).attr('ctype')
      });
    });
  }
  return colors
}

const getColorByGid = function (gid, colors) {
  let hex = null
  $.each(colors, function (id, color) {
    if (gid == color.id) {
      hex = color.hex
    }
  })
  return hex
}

const getTagNameByGid = function (gid, colors) {
  let name = null
  $.each(colors, function (id, color) {
    if (gid == color.id) {
      name = color.ctype
    }
  });
  const arr = name.split('-');
  return arr[arr.length - 1];
};

export const colorizeTags = function (string, elements, colors = [], showTooltip = true, tooltipPlacement = 0) {
  if (string) {
    const cleanstring = cleanString(string)
    const colorArray = colors.length ? colors : colorSelection(cleanstring, 'x, g');
    const wrapper = $('<div>').html(cleanstring)

    wrapper.find('> g').each(function () {
      const highlights = getColorByGid($(this).attr('id'), colorArray)
      const placement = $('<span>').attr('id', $(this).attr('id'))
        .addClass('xtag')
        .addClass($(this).attr('id'))
        .addClass('highlight-text')
        .css('background', highlights)
        .html($(this).find('g').length ? colorizeTags($(this).html(), 'g, x', colorArray, showTooltip, (tooltipPlacement < 4 ? tooltipPlacement + 1 : 4)) : $(this).html())
      if (showTooltip) {
        const tipPlacements = ['bottom', 'left', 'top', 'right']
        placement.attr('data-toggle', 'tooltip');
        placement.attr('title', getTagNameByGid($(this).attr('id'), colorArray));
        placement.attr('data-placement', tipPlacements[tooltipPlacement]);
        placement.attr('data-custom-class', 'tooltip_' + highlights.replace('#', ''))
      }
      $(this).replaceWith(placement);
    });

    wrapper.find('x').each(function () {
      const highlights = getColorByGid($(this).attr('id'), colorArray);
      $(this).replaceWith(
        $('<img>').attr('src', generateTextImage($(this).attr('ctype')))
          .attr('ctype', $(this).attr('ctype'))
          .attr('id', $(this).attr('id'))
          .addClass($(this).attr('id'))
          .addClass('xtag')
          .css('background', highlights)
      );
    });
    setTimeout(() => {
      $('[data-toggle="tooltip"]').tooltip({trigger: 'hover'});
      $('[data-toggle="popover"]').popover({trigger: 'hover', placement: 'top', html: true});
    }, 500);
    return cleanString(wrapper.html());
  }
}

export const nonColorizeTags = function (string) {
  if (string) {
    const cleanstring = cleanString(string)
    const wrapper = $('<div>').html(cleanstring)
    wrapper.find('> g').each(function () {
      $(this).replaceWith(
        ( $(this).find('g').length ? nonColorizeTags($(this).html()) : $(this).text() ) + ' '
      )
    });
    wrapper.find('x').each(function () {
      $(this).replaceWith('');
    });
    return cleanString(wrapper.html())
  }
}