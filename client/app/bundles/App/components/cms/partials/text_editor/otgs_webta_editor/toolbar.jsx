import React from 'react';
import ToolButton from '../tool_button';
import {flashNotify} from '../../../../../constants/notify';
import ActivityTracker, { trackerConstants as c } from '../../../../../services/activity/tracker';
import {shortcutKeyToClass, keyFromMap, keyLabelFromMap} from '../../../../../constants/hotkey_configs';

import {GlossaryFilter} from '../../../../../services/glossary/filter';

import FeatureCopyOriginal from './features/copy_original';
import FeatureSaveSentence from './features/save_sentence';
import FeatureSaveIncompleteSentence from './features/save_incomplete_sentence';
import FeatureMachineTranslation from './features/machine_translation';
import {OtgsWebtaEditorVisibleSpace} from './editor/visible_space';
import CmsIssueModal from '../../issue/issue_modal';
import { ENABLE_MACHINE_TRANSLATION } from '../../../../../constants/app_constants';
import LanguageMappings from '../../../../../adapters/core/language_mappings'
import { CleanLocalizationClient as t } from '../../../../../components/clean_localization/client';
import WebtaSpellcheckerModal from '../../../../spellchecker/modal';
import WebtaSpellcheckerClient from '../../../../../adapters/webta_spellchecker/client';
import * as _ from 'lodash';

export default class OtgsWebtaToolbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visualizeSpaceIsOn: false,
      spellCheckData: [],
      haveSpellChecked: false,
      showSpellCheckModal: false
    };
    this.languageMap = new LanguageMappings(this);
  }

  render() {
    const self = this;

    // TODO: extract all tool-buttons to separate components
    return(
      <div>
        <ul className="nav">
          { self.copyButton() }
          { self.machineTranslationButton() }
          { self.dottedSpaceButton() }
          { self.issuesButton() }
          { self.glossaryButton() }
          { self.saveButton() }
          { self.incompleteButton() }
        </ul>
        <WebtaSpellcheckerModal showSpellCheckModal={this.state.showSpellCheckModal}
                                toggleModal={() => { this.setState({ showSpellCheckModal: !this.state.showSpellCheckModal }) }}
                                lang={_.get(self.props, 'containerProps.cmsData.target_language.iso')}
                                data={this.state.spellCheckData}
                                getContent={() => {return this.props.controller.getUserContent()}}
                                setContent={(content) => { this.props.controller.setContent(content) }}
                                saveContent={this.saveSentence.bind(this)}
        />
      </div>
    );
  }

  machineTranslationButton() {
    const self = this;
    if(!ENABLE_MACHINE_TRANSLATION) return null;
    let popoverContentOverride = null;
    let targetLang = _.get(self.props, 'containerProps.cmsData.target_language.iso');

    const isMachineTranslationSupported = this.languageMap.isMachineTranslationSupported(targetLang);
    if(!isMachineTranslationSupported) popoverContentOverride = 'Target language is not supported for machine translation';

    const popover = (
      <div>
        {t.t('cms.body.sentences.toolbars.machine_translation.desc')}
        <br/>
        <small className="shortcutName">{ keyLabelFromMap('EDITOR', 'MACHINE_TRANSLATION') }</small>
      </div>
    );
    let toolBtn = null;
    if (self.props.containerProps.cmsData.tmt_enabled || ApplicationAdapters.config.targetApp === 'ate') {
      toolBtn = <ToolButton popoverId="machineTranslationPopover"
                            popoverContent={ popover }
                            popoverContentOverride={popoverContentOverride}
                            buttonAction={ () => { self.machineTranslation() } }
                            buttonClass={ `btn-default machine-translation-btn ${shortcutKeyToClass(keyFromMap('EDITOR', 'MACHINE_TRANSLATION'))}` }
                            iconClass={ `fa fa-language` }
                            isButtonDisabled={!isMachineTranslationSupported}
                            canUseButton={ true } />
    }
    return (
      <div>{toolBtn}</div>
    );
  }

  dottedSpaceButton() {
    const self = this;
    const popover = (
      <div>
        {t.t('cms.body.sentences.toolbars.dotted_space.desc')}
        <br/>
        <small className="shortcutName">{ keyLabelFromMap('EDITOR', 'VISUALIZE_SPACES') }</small>
      </div>
    );
    return (
      <div>
        <ToolButton popoverId="visualizeSpacePopover"
                    popoverContent={ popover }
                    buttonAction={ () => { self.visualizeSpaces() } }
                    buttonClass={ `btn-default visualize-spaces-btn ${shortcutKeyToClass(keyFromMap('EDITOR', 'VISUALIZE_SPACES'))}` }
                    iconClass={ this.state.visualizeSpaceIsOn ? `space-view-toggle fa fa-eye` : `space-view-toggle fa fa-eye-slash` }
                    canUseButton={ true } />
      </div>

    )
  }


  copyButton() {
    const self = this;
    const popover = (
      <div>
        {t.t('cms.body.sentences.toolbars.copy.desc')}
        <br/>
        <small className="shortcutName">{ keyLabelFromMap('EDITOR', 'RESET_TO_ORIGINAL') }</small>
      </div>
    );
    return (
      <div>
        <ToolButton popoverId="copyPopover"
                    popoverContent={ popover }
                    buttonAction={ () => { self.copyOriginalToTranslation() } }
                    buttonClass={ `btn-default reset-btn ${shortcutKeyToClass(keyFromMap('EDITOR', 'RESET_TO_ORIGINAL'))}` }
                    iconClass={ `fa fa-copy` }
                    canUseButton={ self.hasAccess() } />
      </div>

    )
  }

  //----------------------------
  issuesButton() {
    if (!ApplicationAdapters.config.IssuesFeatureEnabled) return null;
    const self = this;
    const popover = (
      <div>
        {t.t('cms.body.sentences.toolbars.issue.desc')}
        <br/>
        <small className="shortcutName">{ keyLabelFromMap('EDITOR', 'CREATE_VIEW_SENTENCE_ISSUE') }</small>
      </div>
    );

    return (
      <div>
        <CmsIssueModal showModal={ self.props.showIssueModal }
                       getCmsIssueCount={ self.props.containerProps.getCmsIssueCount }
                       cmsData={ self.props.containerProps.cmsData }
                       toggleCmsModal={ ()=> { self.props.toggleCmsModal() } }
                       dbid={ self.props.containerProps.dbid }
                       app={ self.props.containerProps.app } />
        <ToolButton popoverId="issuePopover"
                    popoverContent={ popover }
                    buttonAction={ ()=> { self.props.toggleCmsModal() } }
                    buttonClass={ `btn-default new-issue-btn ${shortcutKeyToClass(keyFromMap('EDITOR', 'CREATE_VIEW_SENTENCE_ISSUE'))}` }
                    iconClass={`fa fa-comments-o`} />
      </div>
    );
  }
  //-------------------------------------------

  glossaryButton() {
    const self = this;
    const sentenceGlossaries = new GlossaryFilter().filterOutGlossaries(
      self.props.containerProps.glossaries,
      self.props.containerProps.originalString,
      self.props.containerProps.cmsData
    );

    if (!sentenceGlossaries.length) return null;

    return (
      <ToolButton popoverId="glossaryListPopover"
                  popoverContent={t.t('cms.body.sentences.toolbars.glossary.desc')}
                  buttonAction={ self.props.toggleGlossaries }
                  buttonClass={ `btn-default toggle-glossary-btn ${shortcutKeyToClass(keyFromMap('EDITOR', 'TOGGLE_SENTENCE_GLOSSARY'))}` }
                  iconClass="fa fa-book"
                  canUseButton={self.hasAccess()} />
    )
  }

  //---------------------------------

  saveButton() {
    const self = this;

    const popover = (
      <div>
        { t.t('cms.body.sentences.toolbars.save.desc') }
        <br/>
        <small className="shortcutName">{ keyLabelFromMap('EDITOR', 'SAVE_SENTENCE') }</small>
      </div>
    );

    return (
      <div>
        <ToolButton popoverId="saveSentencePopover"
                    popoverContent={ popover }
                    buttonAction={ () => { self.saveSentence()} }
                    buttonPosition="right"
                    buttonClass={ `btn-success save-sentence-btn ${ shortcutKeyToClass(keyFromMap('EDITOR', 'SAVE_SENTENCE'))}_${self.props.dbid}` }
                    iconClass={`fa fa-check`}
                    canUseButton={ self.hasAccess() } />
      </div>
    );
  }

  incompleteButton() {
    const self = this;

    const popover = (
      <div>
        { t.t('cms.body.sentences.toolbars.incomplete.desc') }
        <br/>
        <small className="shortcutName">{ keyLabelFromMap('EDITOR', 'DECLARE_INCOMPLETE') }</small>
      </div>
    );

    return (
      <ToolButton popoverId="incompletePopover"
                  popoverContent={ popover }
                  buttonAction={ ()=> { self.setAsIncomplete() } }
                  buttonPosition="right"
                  buttonClass={`btn-default declare-incomplete-btn ${shortcutKeyToClass(keyFromMap('EDITOR', 'DECLARE_INCOMPLETE'))}`}
                  iconClass={`fa fa-times-circle-o`}
                  canUseButton={self.hasAccess()}/>
    );
  }

  hasAccess() {
    const self = this;
    const app = self.props.containerProps.app;
    const cmsData = self.props.containerProps.cmsData;
    const params = app.params;
    return (params.type == 'translate' || parseInt(cmsData.review_type) == 2);
  }

  setAsIncomplete() {
    const self = this;
    flashNotify(`.preview_${self.props.dbid}`, 'stale');
    new FeatureSaveIncompleteSentence(self.props.controller, self.props.containerProps, self.props).execute();
  }

  copyOriginalToTranslation() {
    new FeatureCopyOriginal(this.props.controller, this.props.containerProps).execute();
  }

  saveSentence() {
    if (this.state.haveSpellChecked) {
      new FeatureSaveSentence(this.props.controller, this.props.containerProps, this.props).execute();
      new ActivityTracker().track(c.SENTENCE_ACTIVITY, {exit_status: 'complete'}, true);
      this.setState({ haveSpellChecked: false });
    } else {
      const client = new WebtaSpellcheckerClient(this.props.containerProps.cmsData.target_language.iso);
      client.spellcheck(OtgsWebtaEditorVisibleSpace.convertBack(this.props.controller.getUserContent()), (response) => {
        if (response.length) {
          const withSuggestionData = [];
          _.forEach(response, (x) => { if (x.suggestions.length) withSuggestionData.push(x) })
          this.setState({
            haveSpellChecked: true,
            showSpellCheckModal: !!withSuggestionData.length,
            spellCheckData: withSuggestionData
          }, () => {
            if (!!!withSuggestionData.length) this.saveSentence();
          });
        } else {
          this.setState({ haveSpellChecked: true, showSpellCheckModal: false }, () => {
            this.saveSentence();
          });
        }
      });
    }
  }

  machineTranslation() {
    new FeatureMachineTranslation(this.props.controller, this.props.containerProps).execute();
  }

  visualizeSpaces() {
    let content = '';
    this.setState({ visualizeSpaceIsOn: !this.state.visualizeSpaceIsOn }, () => {
      if (this.state.visualizeSpaceIsOn) {
        content = OtgsWebtaEditorVisibleSpace.convertElementToVisibleSpaces(this.props.controller.getUserContent());
      } else {
        content = OtgsWebtaEditorVisibleSpace.convertBack(this.props.controller.getUserContent());
      }
      setTimeout(()=>{
        this.props.controller.setViewSpaceMode(this.state.visualizeSpaceIsOn);
        this.props.controller.setContent(content);
        this.props.controller.addLastSpaceIfNeed(this.props.controller.getMceEditor());
      }, 0);
    });
  }
}
