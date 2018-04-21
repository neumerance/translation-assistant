import React from 'react';
import {Popover} from 'react-bootstrap';
import HighLightingChips from '../highlighting_chips';
import XtagTokenChips from '../xtag_token_chips';

export default class OtgsWebtaBottombar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false }
  }

  hasAccess() {
    const self = this;
    const app = self.props.containerProps.app;
    const cmsData = self.props.containerProps.cmsData;
    const params = app.params;
    return (params.type == 'translate' || parseInt(cmsData.review_type) == 2);
  }

  createPopover(id, title, content) {
    return (
      <Popover id={id} title={title}>
        {content}
      </Popover>
    );
  }

  render() {
    const self = this;
    return(
      <div>
        <HighLightingChips colorSelectionData={ self.props.colorSelectionData }
                           canUseChips={ self.hasAccess() }
                           controller={ self.props.controller }
                           dbid={ self.props.dbid }
                           createPopover={ self.createPopover.bind(this) }/>
        <XtagTokenChips xtagSelectionData={ self.props.xtagTokenData }
                        canUseChips={ self.hasAccess() }
                        controller={ self.props.controller }
                        dbid={ self.props.dbid }
                        createPopover={ self.createPopover.bind(this) }/>
      </div>
    );
  }
}
