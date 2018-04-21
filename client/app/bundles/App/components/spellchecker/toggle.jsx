import React from 'react';
import LanguageMappings from "../../adapters/core/language_mappings";
import ToggleButton from 'react-toggle-button';
import * as _ from 'lodash';
import Notify from '../../constants/notify';
import { CleanLocalizationClient as t } from '../../components/clean_localization/client';

const notify = new Notify();

export default class SpellcheckerToggle extends React.Component {
  constructor(props) {
    super(props);
    this.LanguageMappings = new LanguageMappings(this);
    this.state = {
      enabled: !!parseInt($.cookie('spellCheckEnabled'))
    }
  }

  shouldntSpellcheck() {
    const app = this.props.app;
    const cmsData = this.props.cmsData;
    return app.params.type == 'review' && _.get(cmsData, 'review_type', null) == 1
  }

  languageSupported() {
    if (!this.props.cmsData) return false;
    const isSupported = this.LanguageMappings.isSpellCheckerSupported(
      _.get(this.props, 'cmsData.target_language.iso', '')
    );
    if (!isSupported && this.state.enabled) {
      this.setState({ enabled: false }, () => {
        $.cookie('spellCheckEnabled', 0);
      });
    }
    return isSupported;
  }

  handleToggle() {
    if (!this.languageSupported()) {
      notify.error('Language not supported', 'Spellchecker do not support the target language at the moment');
      return;
    }
    this.setState({ enabled: !this.state.enabled }, () => {
      $.cookie('spellCheckEnabled', this.state.enabled ? 1 : 0);
    });
  }
  
  render() {
    if (this.shouldntSpellcheck()) return <div></div>;
    return(
      <div id="spellCheckerToggle">
        <div className="pull-left m-r-5">{t.t('cms.footer.spellchecker.label')}</div>
        <div className="pull-left m-r-5">
         <ToggleButton
             activeLabel={t.t('cms.footer.spellchecker.toggle.true')}
             inactiveLabel={t.t('cms.footer.spellchecker.toggle.false')}
             value={this.state.enabled}
             onToggle={this.handleToggle.bind(this)} />
        </div>
      </div>
    );
  }
}