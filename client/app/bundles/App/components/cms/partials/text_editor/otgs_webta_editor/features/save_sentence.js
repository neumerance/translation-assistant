import * as stringUtils from '../../../../../../services/utils/string_utils';
import * as messages from '../../../../../../constants/app_messages';
import Notify, {flashNotify} from '../../../../../../constants/notify';
import CmsApiRequests from '../../../../../../services/requests/cms_api_requests';
import {Base64} from 'js-base64';
import * as _ from 'lodash';
import {
  shortcutKeyToClass,
  keyFromMap,
} from '../../../../../../constants/hotkey_configs';
import FeaturesNavigation from './navigation';
import {MrkTooltips} from '../../../../../../services/processors/mrk_tooltips'
import {ValidTags} from './validation/valid_tags'
import {OtgsWebtaEditorVisibleSpace} from '../editor/visible_space';

const notify = new Notify();
const cmsApi = new CmsApiRequests();

export default class FeatureSaveSentence {
  constructor(controller, containerProps, toolbarProps) {
    this.controller = controller;
    this.props = containerProps;
    this.toolbarProps = toolbarProps;
  }

  execute() {
    this.saveSentence(2)
  }

  saveSentence(status) {
    const self = this;
    const cmsData = self.props.cmsData;
    const $preview  = $(`#${self.controller.outerDom.previewCssId} > p`);
    const prevValue = $preview[0].innerHTML;

    let editorsValue = stringUtils.cleanString(self.controller.getUserContent());
    editorsValue = OtgsWebtaEditorVisibleSpace.convertBack(this.controller.getUserContent());

    let translated = $('<div>').html(editorsValue);
    const originalTrans = $('<div>').html(stringUtils.cleanString(self.props.source.content));
    let translatableString = $('<div>').html(stringUtils.stripEncapsulatingStringTag(originalTrans.html()));

    if (self.validTranslation(translated, translatableString, status)) {
      if (status == 2) new FeaturesNavigation().nextSentence();
      const xmlString = self.buildXmlStringTranslation(editorsValue);
      let finalTranslation = originalTrans.html().replace(translatableString.html(), xmlString);
      finalTranslation = finalTranslation.replace('<div>', '').replace('</div>', '');
      const params = {
        id: _.get(cmsData, 'id', null),
        xliff_id: _.get(cmsData, 'base_xliff.id', null),
        mrk: {
          id: self.props.dbid,
          translated_text: Base64.encode(stringUtils.removeInvisbleChars(finalTranslation)),
          mstatus: status
        }
      };
      self.props.updateStatus(self.props.mrkIndex, status, finalTranslation);

      const replaceAction = ()=> {
        self.replacePreview($preview, editorsValue, self.props.colorSelectionData);
      };
      setTimeout(replaceAction, 0);

      if (status == 2) flashNotify(`.preview_${self.props.dbid}`, 'success');

      cmsApi.saveCmsJob(params, status, (notif) => {
        if (_.get(notif, 'level', null) === 'error')
          self.showErrorNotification(notif, () => {
            self.props.updateStatus(self.props.mrkIndex, 1, finalTranslation);
            const replaceAction = ()=> {
              self.replacePreview($preview, prevValue, self.props.colorSelectionData);
              self.controller.setContent(prevValue);
              $preview.trigger('click');
            };
            setTimeout(replaceAction, 1000);
        });
      })
    }
  }

  showErrorNotification(notif, callback = () => {}) {
    const self = this;
    flashNotify(`.preview_${self.props.dbid}`, notif.level);
    notify.error('Saving failed', messages.GENERIC_ERROR, true, `.preview_${self.props.dbid}`, 'top right');
    callback();
  }

  replacePreview($preview, editorsValue, colorSelectionData) {
    const mt = new MrkTooltips();
    const $valueWithPopovers = mt.preparePopovers(editorsValue, colorSelectionData);
    $preview.html($valueWithPopovers);
    mt.initPlugin();
  }

  validTranslation(translated, originalElem, status) {
    const self = this;
    let isValid = true;
    if (status != 2) return true;

    const cleanString = stringUtils.stripHtmlEntities(translated.html());
    if (!cleanString.length) {
      const cssClass = `.${shortcutKeyToClass(keyFromMap('EDITOR', 'SAVE_SENTENCE'))}_${self.props.dbid}`;
      notify.error(
        messages.TRANSLATION_NOT_SAVED_TITLE,
        messages.VALIDATE_TRANSLATION_EMPTY,
        true, cssClass,
        'top right'
      );
      return false;
    }

    const data = new ValidTags().data(originalElem, translated);
    if (data.translatedTags.length !== data.originalTags.length) {
      const cssClass = `.${shortcutKeyToClass(keyFromMap('EDITOR', 'SAVE_SENTENCE'))}_${self.props.dbid}`;

      notify.error(
        messages.TRANSLATION_NOT_SAVED_TITLE,
        `${messages.VALIDATE_INCOMPLETE_MARKERS} <br />
        <a href="http://docs.icanlocalize.com/information-for-translators/how-to-apply-formatting-markers-in-webta/"
           target="_blank">Formatting markers help.</a>`,
        true, cssClass,
        'top right'
      );
      return false;
    }

    const originalMap = data.originalTags.map((e) => { return e.path }).join(',');
    const translatedMap = data.translatedTags.map((e) => { return e.path }).join(',');

    if ((originalMap !== translatedMap) && status == 2) {
      notify.error(
        messages.TRANSLATION_NOT_SAVED_TITLE,
        `${messages.VALIDATE_NESTED_MARKERS} <br />
         <a href="http://docs.icanlocalize.com/information-for-translators/how-to-apply-formatting-markers-in-webta/"
         target="_blank">Formatting markers help.</a>`,
        true, `.${shortcutKeyToClass(keyFromMap('EDITOR', 'SAVE_SENTENCE'))}_${self.props.dbid}`,
        'top right'
      );
      return false;
    }
    return isValid;
  }

  buildXmlStringTranslation(translationString = '') {
    const self = this;
    const original = $('<div>').html(stringUtils.cleanString(self.props.source.content));
    const translation = $('<div>').html(stringUtils.cleanString(translationString));
    translation.find('> span, > img').each(function () {
      const elem = $(this);
      const xmlElem = original.find(`#${elem.attr('id')}`);
      const attributes = xmlElem.get(0).attributes;
      const tagName = xmlElem.prop('tagName');
      const replacement = $(`<${tagName.toLowerCase()}>`);
      _.forEach(attributes, (attr, idx) => {
        replacement.attr(attr.name, attr.value);
      });
      (elem.find('> span, > img').length) ? replacement.html(self.buildXmlStringTranslation(elem.html())) : replacement.html(elem.html());
      elem.replaceWith(replacement);
    });
    return translation.html()
  }

  isSpellChecked() {
    const text = this.controller.getUserContent();
    return this.spellCheckStore()[text];
  }

  addSpellChecked(text) {
    this.spellCheckStore()[text] = true
  }

  spellCheckStore() {
    if(!window.spellcheckStore) {
      window.spellcheckStore = {}
    }
    return window.spellcheckStore;
  }

  initSpellCheck(status) {
    const self = this;

    if (status != 2) return true;
    const spellCheckEnabled = parseInt($.cookie('spellCheckEnabled'));

    let isSpellChecked = true;
    if (spellCheckEnabled && !self.isSpellChecked()) {
      self.toolbarProps.toggleSpellCheckModal();
      self.addSpellChecked(self.controller.getUserContent());
      isSpellChecked = false;
    }

    return isSpellChecked;
  }
}
