import React, {Component} from 'react';
import {Link} from 'react-router';
import {OverlayTrigger} from 'react-bootstrap';
import {shortcutKeyToClass, keyFromMap} from '../../../../constants/hotkey_configs';
import ToggleButton from 'react-toggle-button';
import Progress from '../../partials/progress_bar';
import HandleFallBackRedirect from '../../../../adapters/core/handle_fallback_redirect';
import SpellcheckerToggle from '../../../spellchecker/toggle';
import { CleanLocalizationClient as t } from '../../../../components/clean_localization/client';
import * as appConst from "../../../../constants/app_constants";
import * as _ from 'lodash';

export default class CmsShowNavigation extends Component {

  constructor(props) {
    super(props);
  }

  renderSpellcheckToggle() {
    return(
      <SpellcheckerToggle cmsData={this.props.cmsData} app={this.props.app} />
    );
  }

  render() {
    const self = this;
    const app = self.props.app;
    const cmsData = self.props.cmsData;
    const backButton = <a className="btn btn-default pull-left btn-sm" href={new HandleFallBackRedirect().getBackToListUrl()}>
                        &larr; {t.t('cms.footer.back_to_list')}
                       </a>;
    const globalGlossary = <OverlayTrigger trigger={['hover', 'focus']}
                                        placement="top"
                                        overlay={self.props.createPopover(
                                          'toggleGlossaryPopover_TOGGLE_GLOBAL_GLOSSARY', null,
                                          <div>{t.t('cms.footer.glossary.desc')}</div>
                                        )}>
      <button
        className={`btn btn-default btn-sm m-l-5 global-glossary-btn ${shortcutKeyToClass(keyFromMap('EDITOR', 'TOGGLE_GLOBAL_GLOSSARY'))}`}
        onClick={() => {
          self.props.toggleGlossariesPanel()
        }}>
        <i className="fa fa-book"></i> {t.t('cms.footer.glossary.btn')}
      </button>
    </OverlayTrigger>

    const isTranslationIsComplete = self.props.translationCompleted();
    let msg = t.t('cms.footer.finish.desc');
    if (!isTranslationIsComplete) msg = t.t('cms.footer.not_finish.desc');

    let action = () => {
      if(self.props.translationCompleted()) {
        self.props.togglePreview();
      }
    };

    const completeButton = <OverlayTrigger trigger={['hover', 'focus']}
                                           placement="top"
                                           overlay={self.props.createPopover('completePopover', null, msg)}>
                      <button className="btn btn-info btn-sm pull-right preview-job-btn" onClick={action}>{t.t('cms.footer.finish.btn')} &rarr;</button>
    </OverlayTrigger>;

    const progressBar = <Progress app={app}
                                  deadline={_.get(cmsData, 'deadline', '')}
                                  started={_.get(cmsData, 'created_at', '')}
                                  mrks={self.props.mrks}/>
    const status = _.get(cmsData, 'status', '');
    const cmsStatus = <label className={`label label-${status === appConst.COMPLETED ? 'success' : 'info'}`}>{appConst.CMS_STATUSES[status]}</label>;

    return (
      <div id="translationNav" className="sticky-bottom">
        <div className="container">
          <div className="row">
            <table className="table table-slim vertical-middle-table borderless" style={ {width: '100%'} }>
              <tbody>
              <tr>
                <td>{backButton}</td>
                <td>{globalGlossary}</td>
                <td>
                  {progressBar}
                </td>
                <td>{cmsStatus}</td>
                <td>{this.renderSpellcheckToggle()}</td>
                <td>{completeButton}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

}