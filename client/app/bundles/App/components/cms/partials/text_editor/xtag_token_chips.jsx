import React, {Component} from 'react';
import {OverlayTrigger} from 'react-bootstrap';
import {shortcutKeyToClass, keyFromMap} from '../../../../constants/hotkey_configs';
import XtagProcessor from '../../../../services/processors/xtag_processor';
import * as _ from 'lodash';
import * as renderer from '../../../../services/processors/highlighting_tag_renderer';
import * as stringUtils from '../../../../services/utils/string_utils';
import ShortcutKeys from './otgs_webta_editor/editor/shortcut_keys';

export default class XtagTokenChips extends Component {

  constructor(props) {
    super(props);
    this.state = {
      uniqueId: makeid()
    }
  }

  handleXtagTokenPicker(xtag, _idx) {
    const self = this;
    const manager = self.props.controller.getMarkersManager();
    manager.insertXMarker(xtag);
  }

  // TODO: handle case when too many images
  render() {
    const self = this;
    let contextList = [];
    const canUseChips = self.props.canUseChips;
    if (!canUseChips) return <span></span>;

    if (self.props.xtagSelectionData.length) {
      contextList = self.props.xtagSelectionData.map((xtag, idx) => {
        const actionKey = new ShortcutKeys().insertXMarkerKey(idx)
        return (
          <OverlayTrigger key={`${xtag.isSet}_${idx}`}
                          trigger={['hover', 'focus']}
                          placement="top"
                          overlay={self.props.createPopover(`clearPopover_${actionKey.key}`, null, <div>
                            <small>Click to apply marker after cursor.</small>
                          </div>)}>
            <div className="single-chip-container" key={idx} onClick={() => { self.handleXtagTokenPicker(xtag, idx) } }>
              <div style={{background: xtag.hex}}
                   className={ `chip rectangleChip ${shortcutKeyToClass(keyFromMap('EDITOR', actionKey.key))}` }>
                <a className="chip-icon" href="javascript:void(0)">
                  <i className={xtag.isSet ? 'fa fa-check-circle fa-2x' : 'fa fa-minus-circle fa-2x'}></i>
                </a>
                <div className="chip-data">
                  <span className="chip-tag-name">{stringUtils.cleanHtmlName(xtag.type)}</span>
                  <span className="chip-shortcut">
                    {actionKey.pattern.replace('alt', 'Alt').replace('ctrl', 'Ctrl')}
                  </span>
                </div>
              </div>
            </div>
          </OverlayTrigger>
        )
      })
    }

    let defaultContent = (
      <div key={self.state.uniqueId} className="chipContainer">
        {contextList}
      </div>
    );

    return (defaultContent)
  }
}