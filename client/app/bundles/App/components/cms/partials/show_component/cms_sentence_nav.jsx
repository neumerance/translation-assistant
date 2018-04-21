import React, {Component} from 'react';
import {OverlayTrigger} from 'react-bootstrap';
import {keyFromMap, shortcutKeyToClass, keyLabelFromMap} from '../../../../constants/hotkey_configs';
import {CleanLocalizationClient as t} from '../../../../components/clean_localization/client';
import * as messages from '../../../../constants/app_messages';

export default class CmsSentenceNav extends Component {

  render() {
    const self = this;
    return (
      <div style={{position: 'relative'}}>
        <div className="btn-group" style={{position: 'absolute', top: '-25px', right: '0'}}>
          <OverlayTrigger trigger={['hover', 'focus']}
                          placement="top"
                          overlay={self.props.createPopover('prevPopover', null, <div>{t.t('cms.header.arrow.up')}<br/>
                            <small className="shortcutName">{keyLabelFromMap('EDITOR', 'PREV_SENTENCE')}</small>
                          </div>)}>
            <button type="button"
                    className={`btn btn-default prevSentence ${shortcutKeyToClass(keyFromMap('EDITOR', 'PREV_SENTENCE'))}`}
                    onClick={() => {
                      self.props.toggleSentenceEditor('prev');
                    }}>
              <i className="fa fa-chevron-up"></i>
            </button>
          </OverlayTrigger>
          <OverlayTrigger trigger={['hover', 'focus']}
                          placement="top"
                          overlay={self.props.createPopover('nextPopover', null, <div>{t.t('cms.header.arrow.down')}<br/>
                            <small className="shortcutName">{keyLabelFromMap('EDITOR', 'NEXT_SENTENCE')}</small>
                          </div>)}>
            <button type="button"
                    className={`btn btn-default nextSentence ${shortcutKeyToClass(keyFromMap('EDITOR', 'NEXT_SENTENCE'))}`}
                    onClick={() => {
                      self.props.toggleSentenceEditor();
                    }}>
              <i className="fa fa-chevron-down"></i>
            </button>
          </OverlayTrigger>
        </div>
      </div>
    )
  }

}