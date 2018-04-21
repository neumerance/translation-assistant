import * as _ from 'lodash';
import Notify from '../../constants/notify';
const notify = new Notify();

export default class XtagProcessor {

  constructor(tagModel = [], cursorPosition = null, xtagData = {}) {
    this.tagModel = tagModel;
    this.cursorPosition = cursorPosition;
    this.xtagData = xtagData;
  }

  validateExistingSelection(gid) {
    const self = this;
    let model = self.tagModel;
    self.tagModel.map((selection, idx) => {
      if (selection.id == gid) _.pullAt(model, [idx]);
    });
    return model;
  }

  cursorPositionExist() {
    const result = this.cursorPosition >= 0;
    if (!result) notify.error('Unable to insert tag', 'Please click your pointer to where you want to drop the tag in your editor.');
    return result;
  }

  updateSelectionModel(callback = () => {}) {
    const self = this;
    const model = self.validateExistingSelection(self.xtagData.id);
    if (!self.cursorPositionExist()) return callback(model);
    const range = [self.cursorPosition, self.cursorPosition];
    model.push({
      id: self.xtagData.id,
      hex: self.xtagData.hex,
      start: range[0],
      end: range[1],
      name: 'img',
      type: self.xtagData.type,
      addedAt: new Date().getTime()
    });
    callback(model);
  }
}