import React, {Component} from 'react';
import {OverlayTrigger, Popover} from 'react-bootstrap';
import CmsApiRequests from '../../../../services/requests/cms_api_requests';
const api = new CmsApiRequests();
import {keyFromMap, shortcutKeyToClass} from '../../../../constants/hotkey_configs';
import * as _ from 'lodash';
import Confirm from 'react-confirm-bootstrap';
import * as appConst from "../../../../constants/app_constants";

export default class CmsPreviewNavigation extends Component {

  isJobDelivered() {
    if (this.props.cmsData) {
      return this.props.cmsData.status >= 5;
    }
    return false;
  }

  declareAsDone() {
    const self = this;
    const app = self.props.app;
    api.declareAsComplete(app.params.id, app);
  }

  getPreviousUrl() {
    const self = this;
    const app = self.props.app;
    return _.get(localStorage, 'prevUrl', `/cms/${app.params.id}/translate`);
  }

  renderGoBack() {
    const self = this;
    const app = self.props.app;
    return(
      <a className="btn btn-default btn-sm back-to-editor-btn"
         onClick={() => {  app.router.push(self.getPreviousUrl()) }}>
        &larr; Back to editor
      </a>
    )
  }

  createPopover(id, title, content) {
    const popover = (
      <Popover id={id} title={title}>
        {content}
      </Popover>
    );
    return popover;
  }

  render() {
    const self = this;
    const backButton = <OverlayTrigger trigger={['hover', 'focus']}
                                       placement="top"
                                       overlay={self.createPopover('completePopover', null, 'Go back to translation editor')}>
      {self.renderGoBack()}
    </OverlayTrigger>;

    const msg = <div>Declare this job as complete<br/>
      <small>Press [{keyFromMap('EDITOR', 'DECLARE_JOB_AS_COMPLETE')}]</small>
    </div>;

    let completeButton = <OverlayTrigger trigger={['hover', 'focus']}
                                         placement="top"
                                         overlay={self.createPopover('completePopover', null, msg)}>
                          <button className={`btn btn-success btn-sm pull-right ${shortcutKeyToClass(keyFromMap('EDITOR', 'DECLARE_JOB_AS_COMPLETE'))}`}
                                  onClick={self.declareAsDone.bind(this)}>
                            Complete
                          </button>
                        </OverlayTrigger>;

    if (self.isJobDelivered()) {
      completeButton = <Confirm
        onConfirm={self.declareAsDone.bind(this)}
        body={ 'Are you sure you want to redeliver this translation?' }
        confirmText="Yes"
        title="Attention">
        <button className={`btn btn-success btn-sm pull-right`}>Redeliver</button>
      </Confirm>
    }

    const status = _.get(this.props.cmsData, 'status', '');
    const cmsStatus = <label className={`label label-${status === appConst.COMPLETED ? 'success' : 'info'}`}>{appConst.CMS_STATUSES[status]}</label>;

    return (
      <div id="translationNav" className="sticky-bottom">
        <div className="container">
          <div className="row">
            <table className="table table-slim vertical-middle-table borderless" style={ {width: '100%'} }>
              <tbody>
              <tr style={{height: '56px'}}>
                <td>{backButton}</td>
                <td className="text-center">{cmsStatus}</td>
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