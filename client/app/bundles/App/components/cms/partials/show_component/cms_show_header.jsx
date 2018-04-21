import React, { Component } from 'react';
import {getCountryFlag} from '../../../../services/utils/country';
import CmsSentenceNav from './cms_sentence_nav';
import LanguageMappings from '../../../../adapters/core/language_mappings';
import { CleanLocalizationClient as t } from '../../../../components/clean_localization/client';
import * as _ from 'lodash';

export default class CmsShowHeader extends Component {

  constructor(props) {
    super(props);
    this.languageMap = new LanguageMappings(this);
  }

  renderModes() {
    let mode = 'translate';
    const self = this;
    const app = self.props.app
    const cmsData = self.props.cmsData;
    const reviewType = _.get(cmsData, 'review_type', null);
    if (app.params.type == 'review' && reviewType == 1) mode = 'review';
    if (app.params.type == 'review' && reviewType == 2) mode = 'review_edit';
    return (
      <span className="m-r-5" style={{color: '#5cb85c'}}>
        {t.t(`cms.header.mode.${mode}`)}
      </span>
    );
  }

  renderLanguageTitle(type = 'source_language') {
    const cmsData = _.get(this.props, 'cmsData', null);
    if(!cmsData) return ''; 
    const language = this.languageMap.getLanguageByIso(cmsData[type].iso);
    return `${language.name} - (${language.icl_format_iso || language.wpml_iso_format})`;
  }

  render() {
    const self = this;
    const app = self.props.app
    const cmsData = self.props.cmsData;

    return(
      <table className="table borderless">
        <thead>
        <tr>
          <th colSpan="2">
            <h4 className="text-center" style={ {margin: '5px 0 0 0'} }>
              {self.renderModes()} {_.get(cmsData, 'title', '')} - {_.get(cmsData, 'id', null)}
              <button className="btn btn-xs btn-default m-l-10"
                      style={{marginTop: '-4px'}}
                      onClick={ () => {
                        const win = window.open(_.get(cmsData, 'permlink', ''), '_blank');
                        win.focus();
                      } }
                      target="_blank">
                  {t.t('cms.header.view_btn')}
              </button>
            </h4>
          </th>
        </tr>
        <tr>
          <th className="col-md-6 text-center no-border">
            <small className="m-r-5">{t.t('cms.header.source')}</small><br />
            {this.renderLanguageTitle()}
          </th>
          <th className="col-md-6 text-center no-border">
            <small className="m-r-5">{t.t('cms.header.target')}</small><br />
            {this.renderLanguageTitle('target_language')}
            <CmsSentenceNav createPopover={self.props.createPopover}
                            toggleSentenceEditor={self.props.toggleSentenceEditor} />
          </th>
        </tr>
        </thead>
      </table>
    )
  }

}