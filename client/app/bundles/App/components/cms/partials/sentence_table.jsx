import {WordsHighlighter} from '../../../services/glossary/words_highlighter';
import {Base64} from 'js-base64';
import OtgsWebtaEditorContainer from './text_editor/otgs_webta_editor/container';
import IssueCountBadge from './issue/issue_count_badge';
import React, {Component} from 'react';
import * as colorUtils from '../../../services/utils/color_utils';
import MrkParser from '../../../services/processors/mrk_parser';
import * as _ from 'lodash';
import * as stringUtils from '../../../services/utils/string_utils';
import CmsApiRequests from '../../../services/requests/cms_api_requests';
const cmsApi = new CmsApiRequests();

export default class SentenceTable extends Component {

  componentDidMount() {
    const self = this;
    self.showEditor(`.untranslated:first`);
  }

  showEditor(elem) {
    const tr = $(elem).not('div.translationWidget')
    if (!tr.find('.editorWrap').is(':visible')) {
      tr.find('a.preview').trigger('click')
    }
  }

  hasTranslatableMrk(source, target) {
    const self = this;
    const cmsData = self.props.cmsData;
    const text = stringUtils.stripHtmlTags(source.content);
    const hasTranslatableText = !!text.length;
    if (!hasTranslatableText) {
      if (target.mrk_status != 2) {
        const params = {
          id: cmsData.id,
          xliff_id: cmsData.base_xliff.id,
          mrk: {
            id: target.id,
            translated_text: Base64.encode(target.content),
            mstatus: 2
          }
        }
        cmsApi.saveCmsJob(params, 2);
      }
    }
    return hasTranslatableText;
  }

  highlightGlossaryWords(sourceString) {
    const self = this;
    const cmsData = self.props.cmsData;
    const iso = _.get(cmsData, 'source_language.iso', 'en');
    let highlighter = new WordsHighlighter(this.props.glossaries, iso);
    return highlighter.highlightWords(sourceString);
  }

  getSentenceIssueCount(dbId, type) {
    const self = this;
    let sentenceIssueCount = 0;
    const cmsIssueCounts = self.props.issueCounts;
    if (cmsIssueCounts[parseInt(dbId)]) {
      sentenceIssueCount = cmsIssueCounts[parseInt(dbId)][type] ? cmsIssueCounts[dbId][type] : 0
    }
    return sentenceIssueCount
  }

  render() {
    const self = this;
    let trs =  null;
    const sentence = self.props.mrk;
    const source = sentence.source_mrk;
    const target = sentence.target_mrk;
    const cmsData = self.props.cmsData;
    const iso = _.get(cmsData, 'source_language.iso', 'en');
    if (self.hasTranslatableMrk(source, target)) {
      const translatableString = stringUtils.stripEncapsulatingStringTag(source.content);
      const colorBuilder = new colorUtils.ColorBuilder(translatableString);
      const mrkParser = new MrkParser(translatableString);
      const colorSelectionData = colorBuilder.gTagColorSelection(target.mrk_status == 2);
      const xtagTokenData = colorBuilder.xTagColorSelection();
      const colorData = _.concat(colorSelectionData, xtagTokenData);
      const sourceString = mrkParser.colorizeTags(colorData);

      let targetString = '';
      const originalString = sourceString;
      if (!!stringUtils.stripHtmlTags(target.content).length && target.mrk_status != 0) {
        let targetContent = target.content || '';
        const content = stringUtils.stripEncapsulatingStringTag(targetContent);
        targetString = mrkParser.colorizeTags(colorData, true, 0, content);
      }

      const targetContent =
        <OtgsWebtaEditorContainer
          glossaries={self.props.glossaries}
          cmsData={self.props.cmsData}
          defaultValue={targetString}
          target={target}
          source={source}
          originalString={originalString}
          colorSelectionData={colorSelectionData}
          xtagTokenData={xtagTokenData}
          mrkIndex={self.props.mrkIndex}
          mrk={self.props.mrk}
          dbid={target.id}
          toggleSentenceEditor={ (d) => {self.props.toggleSentenceEditor(d)} }
          updateStatus={self.props.updateStatus}
          getCmsIssueCount={self.props.getCmsIssueCount}
          app={self.props.app}
          getAllGlossaries={self.props.getAllGlossaries}>
        </OtgsWebtaEditorContainer>;

      let mrkStatusClass = `mrk_status_${target.mrk_status}`;
      const clientIssueCount = self.getSentenceIssueCount(target.id, 'for_client');
      const translatorIssueCount = self.getSentenceIssueCount(target.id, 'for_translator');
      if (translatorIssueCount && target.mrk_status != 1) mrkStatusClass = 'mrk_has_issue';
      const untranslatedClass = target.mrk_status != 2 ? 'untranslated' : '';

      trs = <tr id={`row_${target.id}`}
                className={`cursor spaced-rows ${untranslatedClass}`}
                onClick={() => {
                  self.showEditor(`#row_${target.id}`)
                }}>
        <td className={`width-50-td wrap-word ${mrkStatusClass}`}>
          <IssueCountBadge elemId={`${target.id}_client`}
                           dbid={target.id}
                           type="to_client"
                           getCmsIssueCount={self.props.getCmsIssueCount}
                           count={clientIssueCount}
                           app={self.props.app}/>
          <div className="original-sentence"
               dir={stringUtils.getStringTypingDirection(iso)}
               dangerouslySetInnerHTML={{__html: self.highlightGlossaryWords(sourceString)}} >
          </div>
        </td>
        <td id={`status_${target.id}`} className={`width-50-td wrap-word preview_${target.id}`} >
          <IssueCountBadge elemId={`${target.id}_translator`}
                           dbid={target.id}
                           type="to_translator"
                           getCmsIssueCount={self.props.getCmsIssueCount}
                           count={translatorIssueCount}
                           app={self.props.app}/>
          {targetContent}
        </td>
      </tr>
    }

    return (
    <div className="vertical-table" id={target.id}>
      <table className="table table-compact vertical-top-table borderless m-b-20 table-hover">
        <tbody>
        {trs}
        </tbody>
      </table>
    </div>
    )
  }
}