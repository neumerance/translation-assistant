import React, {Component} from 'react';
import {Modal, Checkbox} from 'react-bootstrap';
import {Scrollbars} from 'react-custom-scrollbars';
import IssueApiRequests from '../../../../services/requests/issue_api_requests';
const api = new IssueApiRequests();
import * as _ from 'lodash';
import Moment from 'react-moment';

export default class CmsDetailedIssueModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      issues: [],
      currentIssueIdx: 0,
      currentIssue: null,
      agreedToResolved: false
    }
  }

  componentWillReceiveProps(nextProps) {
    const self = this;
    if (nextProps.cmsIssues.length) {
      self.setState({
        issues: nextProps.cmsIssues,
        currentIssue: nextProps.cmsIssues[0]
      })
    }
  }

  selectIssue(idx) {
    const self = this;
    self.setState({
      currentIssueIdx: idx,
      current_messages: self.state.issues[idx].data.messages,
      currentIssue: self.state.issues[idx],
      agreedToResolved: false
    })
  }

  resolveIssue() {
    const self = this;
    const currentIssue = self.state.currentIssue;
    self.setState({ agreedToResolved: false }, () => {
      api.resolveCmsIssue(
        self.props.app.params.id,
        _.get(currentIssue, 'data.id', null),
        () => {
          self.props.fetchIssueCallback();
          self.props.getCmsIssueCount();
        }
      );
    });
  }

  enableDraggableModal() {
    const $elem = $('.issue-modal');
    $elem.draggable({ handle: '.modal-header' });
  }

  removeDraggableModalBindings() {
    const $elem = $('.issue-modal');
    $elem.unbind('draggable');
  }

  render() {
    const self = this;
    const issue_lists = self.state.issues.map((issue, idx) => {
      return (
        <a href="javascript:void(0)"
           key={idx}
           className={'list-group-item list-group-item-action item no-border-radius' + ( self.state.currentIssueIdx == idx ? ' active' : '' )}
           onClick={() => {
             self.selectIssue(idx)
           }}>
          {_.truncate(issue.data.attributes.subject, {length: 35, separator: ' '})}
        </a>
      )
    });


    let issue_messages = null;
    if (self.state.currentIssue) {
      issue_messages = self.state.currentIssue.data.messages.map((message, idx) => {
        const user = message.user;
        return (
          <div className="chats clearfix" key={idx} style={{marginBottom: '10px'}}>
            <div className={'m-0' + ( user.model == 'Translator' ? ' text-left' : ' text-right' )}>
              <span href="javascript:void(0)">
                <small>{user.name} - ({user.nickname}) <i className="fa fa-clock-o"></i> <Moment format="llll">{message.chgtime}</Moment></small>
              </span>
              <p>{message.body}</p>
            </div>
          </div>
        )
      });
    }

    const statuses = {
      issue_closed: <span className="label label-default">Closed</span>,
      issue_open: <span className="label label-info">Open</span>,
    }

    const currentIssue = self.state.currentIssue;
    const currentStatus = _.get(currentIssue, 'data.attributes.status', '').replace(' ', '_').toLowerCase();
    let externalLink = _.get(currentIssue, 'data.links.self', '');
    if (externalLink.match(/http:\/\//g)) {
      externalLink = externalLink.replace(/http:\/\//g, 'https://');
    } else {
      if (!externalLink.match(/https:\/\//g)) {
        externalLink = `https://${externalLink}`;
      }
    }

    return (
      <Modal bsSize="large"
             show={self.props.showModal}
             dialogClassName="issue-modal"
             onEntered={this.enableDraggableModal.bind(this)}
             onExited={this.removeDraggableModalBindings.bind(this)}>
        <Modal.Header>
          <Modal.Title>
            Issues
            <a onClick={() => { self.props.closeModal() }}
               style={{marginTop: '-6px'}} className="pull-right closeLink">
              <i className="fa fa-close"></i>
            </a>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-4">
              <Scrollbars autoHeight autoHeightMin={0} autoHeightMax={500} autoHide={false}>
                <ul className="list-group">
                  {issue_lists}
                </ul>
              </Scrollbars>
            </div>
            <div className="col-md-8">
              <h4>
                <a href={ externalLink }
                   target="_blank">{_.get(currentIssue, 'data.attributes.subject', '')}
                   <i className="fa fa-external-link"></i>
                </a>
              </h4>
              <div className="m-b-20">
                <Scrollbars id="scrollable-box" autoHeight autoHeightMin={0} autoHeightMax={500} autoHide={false}>
                  <div id="issue-conversation" className="m-t-20">
                    {issue_messages}
                  </div>
                </Scrollbars>
                <div>
                  <a href={ externalLink }
                     className="btn btn-info btn-xs pull-right m-t-10"
                     target="_blank">Continue conversation</a>
                  <span className="clearfix"></span>
                </div>
                <hr/>
                <div className={(currentIssue ? (currentIssue.data.attributes.status == 'Issue closed small' ? 'hide' : '') : null)}>
                  <Checkbox checked={self.state.agreedToResolved}
                            onChange={(e) => {
                              self.setState({agreedToResolved: e.target.checked})
                            }}>
                    <small>
                      I confirm that I handled this issue and I consider is as resolved. I understand that resolving this
                      issue will send a notification email and update the issue tracking system.
                    </small>
                  </Checkbox>
                  <a className="btn btn-default btn-xs m-r-5"
                     onClick={self.resolveIssue.bind(this)}
                     disabled={!self.state.agreedToResolved}>Declare as resolved</a>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    )
  }

}