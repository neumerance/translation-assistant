import React, {Component} from 'react';
import Confirm from 'react-confirm-bootstrap';
import Notify from '../../../constants/notify';
import {OverlayTrigger} from 'react-bootstrap';

const notify = new Notify()

export default class CompleteButton extends Component {

  setReadyAndTogglePreview() {
    const self = this;
    if (self.props.translationCompleted) {
      self.props.setReadyToPublish();
      self.props.togglePreview();
    } else {
      const msg = 'All sentences has to be completed before being able to declare the work as complete';
      notify.error('Job can not be completed', msg, true, '.declareCompleteBtn', 'top right');
    }
  }

  render() {
    const self = this;
    const props = self.props;
    const readyToPublish = props.readyToPublish;
    const btnClass = readyToPublish ? 'btn-success' : 'btn-primary';
    const btnText = readyToPublish ? 'Complete' : 'Finish';
    const btnAction = (props.translationCompleted && readyToPublish) ? props.declareAsComplete : self.setReadyAndTogglePreview.bind(this)
    let btn = <button className={`btn btn-sm m-l-5 ${btnClass} ${self.props.addClass}`}
                      onClick={() => {
                        !readyToPublish ? btnAction() : null
                      }}>
      {btnText}
    </button>

    if (readyToPublish) {
      btn = <Confirm
        onConfirm={() => {
          btnAction()
        }}
        body="I confirm that this document is complete and ready for publishing."
        confirmText="Confirmed"
        title="Attention">
        {btn}
      </Confirm>
    }

    return (
      <span className="pull-right">{btn}</span>
    )
  }

}