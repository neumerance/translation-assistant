import React, {Component} from 'react';
import Pluralize from 'react-pluralize';
import DetailedIssueModal from './detailed_issue_modal';
import IssueApiRequests from '../../../../services/requests/issue_api_requests';
const api = new IssueApiRequests();
import * as _ from 'lodash';

export default class IssueCountBadge extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showDetailedIssueModal: false,
      cmsIssues: [],
      uniqueId: makeid(),
      count: 0
    }
  }

  componentWillReceiveProps(props) {
    const self = this;
    if(props.counts != self.state.count) self.setState({
      count: props.count
    });
  }

  fetchIssues() {
    const self = this;
    const app = self.props.app;
    api.fetchCmsIssues(app.params.id, {
      xliff_trans_unit_mrk: {
        data: {
          id: self.props.dbid,
          mrk_type: '1'
        }
      },
      target: self.props.type
    }, (data) => {
      self.setState({
        showDetailedIssueModal: true,
        cmsIssues: data
      });
    });
  }

  closeModal() {
    const self = this;
    self.setState({
      showDetailedIssueModal: !self.state.showDetailedIssueModal
    });
  }

  getCmsIssueCountCallback() {
    const self = this;
    self.setState({
      uniqueId: makeid(),
      count: 0
    }, () => {
      self.props.getCmsIssueCount()
    });
  }

  render() {
    const self = this;
    let badge = null;
    if (self.state.count) {
      badge = <a id={self.props.elemId}
                 href="javascript:void(0)"
                 className="red-text"
                 onClick={ self.fetchIssues.bind(this) }>
        <i className="fa fa-comment"></i> <Pluralize singular="open issue" plural="open issues"
                                                     count={self.state.count}/>
      </a>
    }

    return (
      <div>
        <span key={`${self.props.dbid}_${_.camelCase(self.props.type)}_${self.props.count}_${self.state.uniqueId}`}>
          { badge }
        </span>
        <DetailedIssueModal showModal={ self.state.showDetailedIssueModal }
                            app={ self.props.app }
                            cmsIssues={self.state.cmsIssues}
                            getCmsIssueCount={self.getCmsIssueCountCallback.bind(this)}
                            fetchIssueCallback={ self.fetchIssues.bind(this) }
                            closeModal={ self.closeModal.bind(this) }/>
      </div>
    )
  }

}