import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server'
import {OverlayTrigger} from 'react-bootstrap';
import {shortcutKeyToClass, keyFromMap, keyLabelFromMap} from '../../../../constants/hotkey_configs';
import * as stringUtils from '../../../../services/utils/string_utils';
import Notify from '../../../../constants/notify';
const notify = new Notify();
import HighlightingTagProcessor from '../../../../services/processors/highlighting_tag_processor';
import * as renderer from '../../../../services/processors/highlighting_tag_renderer';
import * as messages from '../../../../constants/app_messages';
import * as _ from 'lodash';
import ShortcutKeys from './otgs_webta_editor/editor/shortcut_keys';

export default class HighLightingChips extends Component {

  constructor(props) {
    super(props);
    this.state = {
      uniqueId: makeid(),
      colorSelectionData: [],
      translation: ''
    }
  }

  componentWillReceiveProps(props) {
    const self = this;
    self.setState({
      colorSelectionData: props.colorSelectionData,
      translation: props.translation
    });
  }

  handleColorPicker(colorData) {
    const manager = this.props.controller.getMarkersManager();
    manager.applyMarker(colorData);
  }

  removeMarker(colorData) {
    const manager = this.props.controller.getMarkersManager();
    manager.removeMarker(colorData);
  }

  tagName(ctype) {
    return ctype.split('-').slice(-1).pop()
  }

  renderChipWithShortKey(color, actionKey) {
    const self = this;
    return (
      <OverlayTrigger key={color.id}
                      trigger={['hover', 'focus']}
                      placement="top"
                      overlay={
                        self.props.createPopover(`clearPopover_${actionKey.key}`,
                        null, <div><small>Select text and click to apply marker</small></div>)}>
        <div className="single-chip-container">
          <a className={`untag-btn ${color.isSet ? 'show' : 'hide'}`} href="javascript:void(0)" onClick={() => {self.removeMarker(color)}}>
            <span className="fa fa-times-circle"></span>
          </a>
          <div className={ `chip chip_${color.id}_${self.props.dbid} ${shortcutKeyToClass(keyFromMap('EDITOR', actionKey.key))}` }
               style={{background: color.hex}}
               onMouseOver={() => { $('.' + color.id + ':first').tooltip('show'); }}
               onMouseOut={() => { $('.' + color.id + ':first').tooltip('hide'); }}
               onClick={() => { self.handleColorPicker(color) }} >
            <a className="chip-icon" href="javascript:void(0)">
              <i className={color.isSet ? 'fa fa-check-circle fa-2x' : 'fa fa-minus-circle fa-2x'}></i>
            </a>
            <div className="chip-data">
              <span className="chip-tag-name">{self.tagName(color.ctype)}</span>
              <span className="chip-shortcut shortcutName">
                {actionKey.pattern.replace('alt', 'Alt').replace('ctrl', 'Ctrl')}
              </span>
            </div>
          </div>
        </div>
      </OverlayTrigger>
    )
  }

  renderChip(color) {
    const self = this;
    return (
      <div key={color.hex} className="single-chip-container">
        <a className={`untag-btn ${color.isSet ? 'show' : 'hide'}`} href="javascript:void(0)" onClick={() => {self.removeMarker(color)}}>
          <span className="fa fa-times-circle"></span>
        </a>
        <div className={`chip chip_${color.id}`} style={{background: color.hex}}
           onClick={() => {
              self.handleColorPicker(color)
           }} >
          <a className="chip-icon" href="javascript:void(0)">
            <i className={color.isSet ? 'fa fa-check-circle fa-2x' : 'fa fa-minus-circle fa-2x'}></i>
          </a>
          <div className="chip-data">
            <span className="chip-tag-name">{self.tagName(color.ctype)}</span>
            <span className="chip-shortcut">
            </span>
          </div>
        </div>
      </div>
    )
  }

  renderChips() {
    const self = this;
    const contextList = self.props.colorSelectionData.map(function (color, index) {
      const actionKey = new ShortcutKeys().insertMarkerKey(index);
      return (actionKey ? self.renderChipWithShortKey(color, actionKey) : self.renderChip(color))
    });

    return contextList;
  }

  render() {
    const self = this;
    const canUseChips = self.props.canUseChips;
    if (!canUseChips) return <span></span>;
    const contextList = self.renderChips();

    return (
      <div key={self.state.uniqueId}>
        <div className={contextList.length ? 'chipContainer' : null} >
          {contextList}
        </div>
      </div>
    );
  }
}