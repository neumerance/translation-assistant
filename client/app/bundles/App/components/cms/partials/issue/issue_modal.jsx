import React, {Component} from 'react';
import {Modal, Button, FormGroup, FormControl, Radio} from 'react-bootstrap';
import ToggleButton from 'react-toggle-button';
import {ISSUE_KINDS} from '../../../../services/utils/app_constants';
import IssueApiRequests from '../../../../services/requests/issue_api_requests';
const api = new IssueApiRequests();
import * as _ from 'lodash';
import Notify from '../../../../constants/notify';
const notify = new Notify();

export default class CmsIssueModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      createParams: {
        xliff_id: null,
        mrk: {
          id: null,
          mrk_type: 1
        },
        issue: {
          message_body: null,
          kind: null
        },
        involve_supporter: false
      },
      fetchParams: {
        xliff_trans_unit_mrk: {
          data: {
            id: null,
            mrk_type: "1"
          }
        }
      },
      issueTypeSelected: false,
      issueMessagePresent: false,
      cmsIssues: []
    }
  }

  componentWillReceiveProps(nextProps) {
    const self = this;
    if (self.props.showModal != nextProps.showModal) {
      const cmsData = self.props.cmsData;
      const createParams = this.state.createParams;
      const fetchParams = this.state.fetchParams;
      createParams.xliff_id = _.get(cmsData, 'base_xliff.id', null);
      createParams.mrk.id = nextProps.dbid;
      fetchParams.xliff_trans_unit_mrk.data.id = nextProps.dbid;
      self.setState({
        showModal: nextProps.showModal,
        createParams,
        fetchParams
      });
    }
  }

  saveIssue() {
    const self = this;
    const cmsData = self.props.cmsData;
    const targetType = _.get(self.state, 'createParams.issue.target_type', 'client');
    api.createCmsIssues(_.get(cmsData, 'id', null), self.state.createParams, () => {
      self.props.getCmsIssueCount();
      self.props.toggleCmsModal();
    });
  }

  setFieldValue(field, input) {
    const self = this;
    const text = input.target.value;
    const next_params = self.state.createParams;
    _.set(next_params, field, text);
    self.setState({
      createParams: next_params
    });
  }

  isForReview() {
    return _.get(this.props, 'cmsData.review_type') && _.get(this.props, 'app.params.type') == 'review'
  }

  closeModal() {
    const self = this;
    self.setState({
      issueMessagePresent: false,
      issueTypeSelected: false
    }, () => {
      self.props.toggleCmsModal();
    })
  }

  toggleInvolveSupporter() {
    const createParams = this.state.createParams;
    createParams.involve_supporter = !createParams.involve_supporter;
    this.setState({ createParams });
  }

  renderCreateTicketSwitch() {
    if (!this.isForReview()) return null;
    return(
      <FormGroup controlId="formControlsInput">
            <div className="pull-left m-r-10">
              <ToggleButton value={this.state.createParams.involve_supporter} onToggle={this.toggleInvolveSupporter.bind(this)}/>
            </div>
            <div className="pull-left">
              Submit support ticket for this issue.
            </div>
            <div className="clear"/>
          </FormGroup>
    );
  }

  render() {
    const self = this;
    const app = self.props.app;
    const cmsData = self.props.cmsData;
    const targetType = _.get(self.state, 'createParams.issue.target_type', 'client');

    const issue_types = ISSUE_KINDS.map((type, index) => {
      return (
        <option value={ type.value } key={ type.value }>{ type.name }</option>
      )
    })

    return (
      <Modal show={self.props.showModal}>
        <Modal.Header>
          <Modal.Title>Issues</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Raise a new issue for the {targetType} to handle</h4>
          <FormGroup controlId="formControlsSelect">
            <FormControl componentClass="select"
                         placeholder="select"
                         onChange={ (e) => {
                           self.setFieldValue('issue.kind', e);
                           self.setState({issueTypeSelected: e.target.value.length})
                         } }>
              <option value=""> -- Ask your question or describe the problem --</option>
              { issue_types }
            </FormControl>
          </FormGroup>
          <FormGroup controlId="formControlsTextarea">
            <FormControl componentClass="textarea"
                         placeholder="Your questions ..."
                         disabled={ !self.state.issueTypeSelected }
                         onChange={ (e) => {
                           self.setFieldValue('issue.message_body', e);
                           self.setState({issueMessagePresent: e.target.value.length})
                         } }/>
          </FormGroup>
          {this.renderCreateTicketSwitch()}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-info"
                  onClick={ () => { self.saveIssue() }}
                  disabled={ !self.state.issueMessagePresent }>Create issue</button>
          <button className="btn btn-default pull-left"
                  onClick={ self.closeModal.bind(this) }>Close</button>
        </Modal.Footer>
      </Modal>
    )
  }

}