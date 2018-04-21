import * as _ from 'lodash';
import * as stringUtils from '../utils/string_utils';
import * as colorUtils from '../utils/color_utils';
import {MrkTooltips} from '../processors/mrk_tooltips';

export default class MrkParser {

  constructor(string = '') {
    this.string = stringUtils.cleanString(string);
    this.colorBuilder = new colorUtils.ColorBuilder(string);
  }

  colorizeGtags(wrapper = null, colorArray = [], showTooltip = true, tooltipPlacement = 0) {
    const self = this;
    const elements = 'g';
    if (wrapper) {
      wrapper.find(`> ${elements}`).each(function () {
        const highlights = colorUtils.getColorByGid($(this).attr('id'), colorArray);
        const newPlacement = (tooltipPlacement < 4 ? tooltipPlacement + 1 : 4);
        const htmlString = $(this).html();
        const placement = $('<span>').attr('id', $(this).attr('id'))
          .addClass('xtag')
          .addClass($(this).attr('id'))
          .addClass('highlight-text')
          .css('background', highlights)
          .html(
            $(this).find(elements).length ?
              self.colorizeTags(colorArray, showTooltip, newPlacement, htmlString) : htmlString
          );
        if (showTooltip) {
          const tipPlacements = ['bottom', 'left', 'top', 'right'];
          placement.attr('data-toggle', 'tooltip');
          placement.attr('title', self.buildFullGtagTitle($(this), colorArray));
          placement.attr('data-placement', tipPlacements[tooltipPlacement]);
          placement.attr('data-custom-class', 'tooltip_' + (highlights || '').replace('#', ''))
        }
        $(this).replaceWith(placement);
      });
    }
    return wrapper;
  }

  buildFullGtagTitle($element, colorArray) {
    return colorUtils.getTagNameByGid($element.attr('id'), colorArray);
  }

  colorizeXtags(wrapper, colorArray) {
    const elements = 'x';
    wrapper.find(elements).each(function () {
      const highlights = colorUtils.getColorByGid($(this).attr('id'), colorArray);
      const tagName = stringUtils.cleanHtmlName($(this).attr('ctype'));
      const imgTag = $('<img>').attr('src', stringUtils.generateTextImage($(this).attr('ctype')))
        .attr('ctype', $(this).attr('ctype'))
        .attr('id', $(this).attr('id'))
        .attr('title', tagName)
        .addClass($(this).attr('id'))
        .addClass('xtag')
        .css('background', highlights);
      $(this).replaceWith(`&#x2063;${imgTag.get(0).outerHTML}&#x2063;`);
    });
    return wrapper;
  }

  colorizeTags(colorArray = [], showTooltip = true, tooltipPlacement = 0, stringOverride = null) {
    const self = this;
    let wrapper = $('<div>').html(stringOverride ? stringOverride : self.string);
    wrapper = self.colorizeGtags(wrapper, colorArray, showTooltip, tooltipPlacement);
    wrapper = self.colorizeXtags(wrapper, colorArray);
    new MrkTooltips().init(wrapper);
    return stringUtils.cleanString(wrapper.html());
  }
}