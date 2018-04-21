import React, { Component } from 'react';
import CmsApiRequests from '../../../../services/requests/cms_api_requests';
const api = new CmsApiRequests();
import * as stringUtils from '../../../../services/utils/string_utils';
import ContentPreloader from '../content_preloader';
import CmsPreviewNavigation from './cms_preview_navigation';
import * as _ from 'lodash';

export default class CmsPreview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      content: null,
      cmsData: null
    }
  }

  getCmsDetails() {
    const self = this;
    const app = self.props.app;
    api.getCmsDetails(app.params.id, {translation_type: app.params.type}, (object) => {
      self.setState({ cmsData: object.cmsData });
    });
  }

  getCmsPreview() {
    const self = this;
    const app = self.props.app;
    api.getCmsPreview(app.params.id, (content) => {
      self.setState({ content: content });
    });
  }

  componentDidMount() {
    const self = this;
    self.getCmsDetails();
    self.getCmsPreview();
  }

  render() {
    const self = this;
    const cmsData = self.state.cmsData;
    const iso = _.get(cmsData, 'target_language.iso', 'en');

    let content = <ContentPreloader />;
    if (self.state.content) content = <div className="col-md-12"
                                           dir={stringUtils.getStringTypingDirection(iso)}
                                           dangerouslySetInnerHTML={{__html: self.state.content}}></div>
    return(
      <div>
        <div className="container cms-preview-container">
          <div className="row">
            {content}
          </div>
        </div>
        <CmsPreviewNavigation cmsData={self.state.cmsData}
                              app={self.props.app} />
      </div>
    )
  }

}