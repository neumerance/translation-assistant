import React, {Component} from 'react';
import {Popover, OverlayTrigger} from 'react-bootstrap';
import * as _ from 'lodash';

export default class ToolButton extends Component {

  createPopover(id, title, content) {
    const popover = (
      <Popover id={id} title={title}>
        {this.props.popoverContentOverride || content}
      </Popover>
    );
    return popover;
  }

  render() {
    const self = this;
    const canUseButton = self.props.canUseButton;
    const buttonPosition = _.get(self.props, 'buttonPosition', 'left');
    let defaultContent = <OverlayTrigger trigger={['hover', 'focus']}
                                         placement="top"
                                         overlay={
                                           self.createPopover(self.props.popoverId, null, self.props.popoverContent)
                                         }>
      <li className={`inline-block m-r-1 pull-${buttonPosition}`}>
        <button className={'btn m-b-2 ' + (self.props.buttonClass ? self.props.buttonClass : 'btn-default') }
                disabled={ self.props.isButtonDisabled }
                onClick={() => {
                  self.props.buttonAction()
                }}>
          <i className={self.props.iconClass}></i>
        </button>
      </li>
    </OverlayTrigger>
    if (!canUseButton) defaultContent = <span></span>;
    return (defaultContent)
  }

}

ToolButton.defaultProps = {
  canUseButton: true
};
