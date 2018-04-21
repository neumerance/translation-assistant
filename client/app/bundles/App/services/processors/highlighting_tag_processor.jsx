import {WordsScanner} from '../glossary/words_scanner';
import * as _ from 'lodash';
import * as stringUtils from '../utils/string_utils';

const scanner = new WordsScanner();
import Notify from '../../constants/notify';
const notify = new Notify();

export default class HighlightingTagProcessor {

  constructor(tagModel = [], selectedText = '', selectedTextPosition = null, currentTranslation = '', colorData = {}) {
    this.tagModel = tagModel;
    this.selectedText = selectedText.toLowerCase();
    this.selectedTextPosition = selectedTextPosition
    this.currentTranslation = currentTranslation.toLowerCase();
    this.colorData = colorData;
  }

  hasDifference(left, right) {
    let leftArray = left;
    const rightArray = right;
    leftArray = _.difference(leftArray, rightArray);
    return leftArray.length != left.length && leftArray.length != 0;
  }

  isRangeIntersected(range) {
    const self = this;
    let result = false;
    const indexRange = _.range(range[0], range[1]);
    self.tagModel.map((selection, idx) => {
      const selectionRange = _.range(selection.start, selection.end);
      const left = self.hasDifference(indexRange, selectionRange);
      const right = self.hasDifference(selectionRange, indexRange);
      if (left && right) result = true;
    });
    return result;
  }

  removeExistingTag(gid) {
    const self = this;
    let model = self.tagModel;
    self.tagModel.map((selection, idx) => {
      if (selection.id == gid) _.pullAt(model, [idx]);
    });
    return model;
  }

  updateSelectionModel(callback = () => {}, tagName = 'span') {
    const self = this;
    const model = self.removeExistingTag(self.colorData.id);
    const range = new SelectedTextDetector(
      self.currentTranslation, self.selectedText, self.selectedTextPosition
    ).getRange();

    if (!range.length) return model;
    if (self.isRangeIntersected(range)) {
      notify.error('Unable to highlight selected text', 'You have selected a part of a text that belongs to other tag.');
      callback(model);
      return;
    }
    model.push({
      id: self.colorData.id,
      hex: self.colorData.hex,
      start: range[0],
      end: range[1],
      name: tagName,
      addedAt: new Date().getTime()
    });
    callback(model);
  }



}
