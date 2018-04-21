import React, {Component} from 'react';
import {Popover, OverlayTrigger} from 'react-bootstrap';
import Confirm from 'react-confirm-bootstrap';

export default class ConfirmableToolButton extends Component {

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

    return (
      <OverlayTrigger trigger={['hover', 'focus']}
                      placement="top"
                      overlay={
                        self.createPopover(self.props.popoverId, null, self.props.popoverContent)
                      }>
        <li className="inline-block m-r-1">
          <Confirm
            onConfirm={() => {
              self.props.buttonAction()
            }}
            body={ self.props.confirmMessage }
            confirmText="Yes"
            title="Attention">
            <button className={'btn m-r-1 ' + (self.props.buttonClass ? self.props.buttonClass : 'btn-default') }
                    disabled={ self.props.isButtonDisabled }>
              <i className={self.props.iconClass}></i>
            </button>
          </Confirm>
        </li>
      </OverlayTrigger>
    )
  }

}