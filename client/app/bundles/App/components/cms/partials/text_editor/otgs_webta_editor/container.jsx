import React from 'react';

import OtgsWebtaEditorController from './editor/controller'
import OtgsWebtaEditor from './editor'
import OtgsWebtaToolbar from './toolbar'
import OtgsWebtaBottombar from './bottombar'
import GlossaryList from '../../../partials/glossary/glossary_list'
import {GlossaryFilter} from '../../../../../services/glossary/filter';
import * as stringUtils from '../../../../../services/utils/string_utils';
import ActivityTracker, { trackerConstants as c } from '../../../../../services/activity/tracker';
import BackgroundSpellcheckerNotif from './background_spellchecker_notif';

export default class OtgsWebtaEditorContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      uniqueId: makeid(),
      showIssueModal: false,
      showGlossariesModal: false,
      showSpellCheckModal: false,
      showNewGlossary: false,
      colorSelectionData: props.colorSelectionData,
      xtagTokenData: props.xtagTokenData
    }
  }

  startEditing() {
    const app = this.props.app;
    const cmsData = this.props.cmsData
    const iso = _.get(this.props.cmsData, 'target_language.iso', 'en');
    const direction = stringUtils.getStringTypingDirection(iso);
    const controller = new OtgsWebtaEditorController(this.state.uniqueId, direction);
    if (controller.outerDom.expandEditor()) {
      new ActivityTracker().trackSentenceActivity(cmsData, app, this.props.originalString);
    }
  }

  toggleCmsModal() {
    const self = this;
    self.setState({ showIssueModal: (!self.state.showIssueModal) })
  }

  toggleGlossaries() {
    const self = this;
    self.setState({ showGlossariesModal: (!self.state.showGlossariesModal) })
  }

  toggleNewGlossary() {
    const self = this;
    self.setState({ showNewGlossary: (!self.state.showNewGlossary) });
  }

  toggleSpellCheckModal() {
    const self = this;
    self.setState({ showSpellCheckModal: (!self.state.showSpellCheckModal) });
  }

  insertTermToEditor(term, controller) {
    const self = this;

    controller.insertContent(term);
    self.setState({ defaultValue: controller.getUserContent() });
  }

  updateChips(_content, controller) {
    const manager = controller.getMarkersManager();
    manager.updateMarkerData(this.state.colorSelectionData);
    manager.updateMarkerData(this.state.xtagTokenData);

    this.setState({
      colorSelectionData: this.state.colorSelectionData,
      xtagTokenData: this.state.xtagTokenData
    })
  }

  render() {
    const self = this;

    const iso = _.get(this.props.cmsData, 'target_language.iso', 'en');
    const direction = stringUtils.getStringTypingDirection(iso);

    const editorController = new OtgsWebtaEditorController(this.state.uniqueId, direction);
    if((this.state.colorSelectionData.length + this.state.xtagTokenData.length) > 0) {
      editorController.addChangeCallback('chips', (content)=>{
        self.updateChips(content, editorController)
      });
    }

    const sentenceGlossaries = new GlossaryFilter().filterOutGlossaries(
      self.props.glossaries, self.props.originalString, self.props.cmsData
    );

    let previewText = (self.props.defaultValue || self.props.originalString);
    if (self.props.target.mrk_status == 0 || !self.props.defaultValue) {
      previewText = '<a class="preview no-hover-lines block"><span class="text-center block btn btn-default btn-block">Click to edit translation</span></a>'
    }

    const textDirection = stringUtils.getStringTypingDirection(iso);

    return(
      <div className="otgs-webta-editor-container" onClick={ ()=> { self.startEditing() } } >
        <div id={ editorController.outerDom.previewCssId }
             className={ `editor-preview expanded full-width` }>
            <BackgroundSpellcheckerNotif controller={ editorController } 
                                     containerProps={ self.props } 
                                     mrkStatus={self.props.target.mrk_status}
                                     currentString={(self.props.defaultValue || self.props.originalString)} />
            <p dangerouslySetInnerHTML={ {__html: previewText } }
            dir={textDirection}
            />
        </div>
        <div id={ `editor-tool-container-${self.state.uniqueId}` }
             className={ `editor-tool-container collapsed` } >

          <OtgsWebtaToolbar controller={ editorController }
                            showIssueModal={ self.state.showIssueModal }
                            toggleCmsModal={ ()=> { self.toggleCmsModal() } }
                            showGlossariesModal={ self.state.showGlossariesModal }
                            toggleGlossaries={ ()=> { self.toggleGlossaries() } }
                            showSpellCheckModal={ self.state.showSpellCheckModal }
                            toggleSpellCheckModal={ ()=> { self.toggleSpellCheckModal() } }
                            dbid={ self.props.dbid }
                            containerProps={ self.props } />

          <OtgsWebtaEditor originalString={ (self.props.defaultValue || (textDirection == 'rtl' ? '' : self.props.originalString)) }
                           controller={ editorController }
                           dbid={ self.props.dbid }
                           colorSelectionData={ self.state.colorSelectionData }
                           xtagTokenData={ self.state.xtagTokenData } />
          <GlossaryList app={ self.props.app }
                        isShown={ self.state.showGlossariesModal }
                        cmsData={ self.props.cmsData }
                        glossaries={ sentenceGlossaries }
                        containerProps={ self.props }
                        showNewGlossary = { self.state.showNewGlossary }
                        toggleGlossaries={ ()=> { self.toggleGlossaries() } }
                        toggleNewGlossary={ ()=> { self.toggleNewGlossary() } }
                        insertTermToEditor={ (term) => { self.insertTermToEditor(term, editorController) } } />

          <OtgsWebtaBottombar containerProps={ self.props }
                              colorSelectionData={ self.state.colorSelectionData }
                              xtagTokenData={ self.state.xtagTokenData }
                              controller={ editorController } />
        </div>
      </div>
    )
  }
};
