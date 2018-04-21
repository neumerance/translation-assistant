import React, { Component } from 'react';
import {Popover, OverlayTrigger} from 'react-bootstrap';
import SpellCheckApiRequest from '../../../../../services/requests/spellcheck_api_request';

const api = new SpellCheckApiRequest();

export default class BackgroundSpellcheckerNotif extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorCount: 0,
      sentence: props.currentString,
      spellChecked: false
    }
  }

  render() {
    const self = this;
    let icon = <span></span>;
    const content = `There ${self.state.errorCount > 1 ? 'are' : 'is'} ${self.state.errorCount} mispelled word${self.state.errorCount > 1 ? 's' : ''} in your translation. Please consider turning spellchecker on then hit the green button again.`;
    if(self.state.hasError) icon = <span className="fa fa-exclamation-circle text-scarlet"></span>; 
    return(
      <span className="pull-right">
        <OverlayTrigger trigger={['hover', 'focus']}
                        placement="top"
                        overlay={self.createPopover(makeid(), 'Spellcheck', content)}>
          {icon}
        </OverlayTrigger>
      </span>
    );
  }

  componentDidMount() {
      this.executeSpellCheck();
  }

  componentWillReceiveProps(nextProps) {
    let newSentence = '';
    try { newSentence = nextProps.controller.getUserContent(); } catch(err) {}
    if (this.state.sentence !== newSentence || this.props.mrkStatus !== nextProps.mrkStatus) {
        this.setState({sentence: newSentence}, () => {
            this.executeSpellCheck();
        });
    }
  }

  createPopover(id, title, content) {
    const popover = (
      <Popover id={id} title={title}>
        {content}
      </Popover>
    );
    return popover;
  }

  executeSpellCheck() {
    if (this.props.mrkStatus !== 2) return;
    const self = this;
    const cmsData = self.props.containerProps.cmsData;
    const sentence = this.state.sentence;
    const spellCheckEnabled = !!parseInt($.cookie('spellCheckEnabled'));
    const currentState = self.state;
    if(spellCheckEnabled) {
        self.clearSpellCheckNotif();
        return;
    };
    api.spellCheckSentence(_.get(cmsData, 'target_language', ''), sentence, (data) => {
      if(data.length) {
        currentState.errorCount = data.length;
        currentState.hasError = true;
        self.setState({...currentState});
      } else {
        self.clearSpellCheckNotif();
      }
    });
  }

  clearSpellCheckNotif() {
    const currentState = this.state;
    currentState.errorCount = 0;
    currentState.hasError = false;
    this.setState({...currentState});
  }

}