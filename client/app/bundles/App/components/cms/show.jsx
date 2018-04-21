import React, {Component} from 'react';
import CmsApiRequests from '../../services/requests/cms_api_requests';
import GlossaryApiRequests from '../../services/requests/glossary_api_request';
import IssueApiRequests from '../../services/requests/issue_api_requests';
import Notify from '../../constants/notify';
import {Popover} from 'react-bootstrap';
import CmsShowNavigation from './partials/show_component/cms_show_navigation';
import GlossaryPanelModal from './partials/glossary/panel_modal';
import CmsShowHeader from './partials/show_component/cms_show_header';
import SentenceTable from './partials/sentence_table';
import ContentPreloader from './partials/content_preloader';
import * as browserCheck from '../../services/utils/browser_check';
import * as _ from 'lodash';
import ActivityTracker, { trackerConstants as c } from '../../services/activity/tracker';
import ActivityCommitter from '../../services/activity/committer';
import AteHandleFallBackRedirect from "../../adapters/external/ate/handle_fallback_redirect";

const notify = new Notify();
const glossaryApi = new GlossaryApiRequests();
const issueApi = new IssueApiRequests();

export default class CmsShow extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mrks: [],
      cmsData: null,
      cmsPreviewContent: null,
      glossaryPanelOpened: false,
      glossaries: [],
      issueCounts: {}
    }
  }

  componentWillMount() {
    const self = this;
    self.getCmsDetails();
    self.getAllGlossaries();
    self.getCmsIssueCount();
    browserCheck.redirectIfNotSupportedBrowser(self.props.app.router);
  }

  componentWillReceiveProps(nextProps) {
    const self = this;
    if (nextProps.app.params.type != this.props.app.params.type) {
      self.getCmsDetails(nextProps.app.params.type);
    }
  }

  componentWillUnmount() {
    new ActivityCommitter().storeAndCommitAll()
  }

  getCmsDetails(translation_type) {
    const self = this;
    const app = self.props.app;
    if (!translation_type) { translation_type = app.params.type }

    const api = new CmsApiRequests({app: app});
    api.getCmsDetails(app.params.id, {translation_type: translation_type}, (object) => {
      self.setState({
        mrks: object.mrks,
        cmsData: object.cmsData
      }, () => {
        const cmsData = self.state.cmsData;
        new AteHandleFallBackRedirect().setFallbackUrl(this.state.cmsData);
        new ActivityTracker().trackCmsJobActivity(cmsData, app);
      });
    });
  }

  getAllGlossaries() {
    const self = this;
    const app = self.props.app;
    glossaryApi.getAllGlossaries(app.params.id, (response) => {
      self.setState({ glossaries: _.get(response, 'data', []) });
    });
  }

  getCmsIssueCount() {
    const self = this;
    const app = self.props.app;
    issueApi.getCmsIssueCount(app.params.id, (data) => {
      self.setState({
        issueCounts: data
      });
    });
  }

  toggleGlossariesPanel() {
    this.setState({glossaryPanelOpened: !this.state.glossaryPanelOpened});
  }

  createPopover(id, title, content) {
    const popover = (
      <Popover id={id} title={title}>
        {content}
      </Popover>
    );
    return popover;
  }

  togglePreview() {
    const self = this;
    const app = self.props.app;
    _.set(localStorage, 'prevUrl', app.router.location.pathname);
    app.router.push(`/cms/${app.params.id}/${app.params.type}/preview`);
  }

  translationCompleted() {
    const self = this;
    const app = self.props.app;
    return parseFloat(app.cms_progress) >= 100
  }

  hideAllEditor() {
    $('.preview').show();
    $('.editorWrap:visible').slideUp('fast');
  }

  toggleSentenceEditor(direction = 'next') {
    const self = this;
    const currentWrap = $('.editorWrap:visible');
    const currentWrapIndex = $('.editorWrap').index(currentWrap);
    const nextIndex = (direction == 'next') ? (currentWrapIndex + 1) : (currentWrapIndex - 1);
    const elem = $('.editorWrap:nth(' + nextIndex + ')');
    self.hideAllEditor();
    if (elem) elem.parent().find('.preview').trigger('click');
  }

  updateStatus(mrkIndex, status, translated = null) {
    const self = this;
    const mrks = self.state.mrks;
    mrks[mrkIndex].target_mrk.mrk_status = status;
    if (translated) mrks[mrkIndex].content = translated;
    self.setState({mrks: mrks, defaultValue: translated});
  }

  render() {
    const self = this;
    const app = self.props.app;
    const navigation = <CmsShowNavigation app={app}
                                        createPopover={self.createPopover.bind(this)}
                                        toggleGlossariesPanel={self.toggleGlossariesPanel.bind(this)}
                                        togglePreview={ self.togglePreview.bind(this) }
                                        translationCompleted={ self.translationCompleted.bind(this) }
                                        cmsData={self.state.cmsData}
                                        mrks={self.state.mrks} />
    let sentences = <ContentPreloader />;
    if (self.state.mrks.length) sentences = self.state.mrks.map((mrk, mrkIndex) => {
      return (
        <SentenceTable key={mrkIndex}
                       mrk={mrk}
                       app={app}
                       mrkIndex={mrkIndex}
                       glossaries={self.state.glossaries}
                       issueCounts={self.state.issueCounts}
                       cmsData={self.state.cmsData}
                       toggleSentenceEditor={ (d) => {
                         self.toggleSentenceEditor(d)
                       } }
                       getCmsIssueCount={self.getCmsIssueCount.bind(this)}
                       updateStatus={self.updateStatus.bind(this)}
                       getAllGlossaries={self.getAllGlossaries.bind(this)} />
      )
    });

    return(
      <div id="translationTables" style={{marginBottom: '200px'}}>
        <div className="cmsHeader sticky bg-white" style={{zIndex: 9, borderBottom: '1px solid #CCC'}}>
          <div style={{position: 'relative'}}>
            <div className="container">
              <CmsShowHeader cmsData={self.state.cmsData}
                             app={app}
                             createPopover={self.createPopover.bind(this)}
                             toggleSentenceEditor={self.toggleSentenceEditor.bind(this)} />
            </div>
          </div>
        </div>
        <div className="container m-t-20">{sentences}</div>
        {navigation}
        <GlossaryPanelModal app={app}
                            cmsData={ self.state.cmsData }
                            glossaries={ self.state.glossaries }
                            show={self.state.glossaryPanelOpened}
                            getAllGlossaries={self.getAllGlossaries.bind(this)}
                            toggleGlossariesPanel={self.toggleGlossariesPanel.bind(this)}/>
      </div>
    )
  }

}