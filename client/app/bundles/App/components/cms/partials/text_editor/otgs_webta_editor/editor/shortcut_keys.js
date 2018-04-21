import { keyFromMap } from '../../../../../../constants/hotkey_configs';

export default class ShortcutKeys {
  insertMarkerKey(index) {
    const shortcutIndex = this.convertIndex(index);
    if(!shortcutIndex) return null;
    const actionKey = `INSERT_MARKER_${shortcutIndex}`;
    const pattern = keyFromMap('EDITOR', actionKey);
    return { key: actionKey, pattern: pattern };
  }

  insertXMarkerKey(index) {
    const shortcutIndex = this.convertIndex(index);
    if(!shortcutIndex) return null;
    const actionKey = `INSERT_XTAG_TOKEN_${shortcutIndex}`;
    const pattern = keyFromMap('EDITOR', actionKey);
    return { key: actionKey, pattern: pattern };
  }

  convertIndex(index) {
    let shortcutIndex = index + 1;
    if(shortcutIndex == 10) shortcutIndex = 0;
    if(shortcutIndex > 10) return null;
    return shortcutIndex;
  }
  // TODO: move real pattern here
  nextSentencePattern() { return keyFromMap('EDITOR', 'NEXT_SENTENCE'); }
  prevSentencePattern() { return keyFromMap('EDITOR', 'PREV_SENTENCE'); }
  clearTranslationPattern() { return keyFromMap('EDITOR', 'CLEAR_TRANSLATION'); }
  saveSentencePattern() { return keyFromMap('EDITOR', 'SAVE_SENTENCE'); }
  createSentenceIssuePattern() { return keyFromMap('EDITOR', 'CREATE_VIEW_SENTENCE_ISSUE'); }
  resetToOriginalPattern() { return keyFromMap('EDITOR', 'RESET_TO_ORIGINAL'); }
  declareJobAsCompletePattern() { return keyFromMap('EDITOR', 'DECLARE_JOB_AS_COMPLETE'); }
  switchPreviewPattern() { return keyFromMap('EDITOR', 'SWITCH_PREVIEW'); }
  switchTranslatePattern() { return keyFromMap('EDITOR', 'SWITCH_TRANSLATE'); }
  toggleSentenceGlossaryPattern() { return keyFromMap('EDITOR', 'TOGGLE_SENTENCE_GLOSSARY'); }
  toggleGlobalGlossaryPattern() { return keyFromMap('EDITOR', 'TOGGLE_GLOBAL_GLOSSARY'); }
  insertGlossaryTermPattern(numKey) { return keyFromMap('EDITOR', `INSERT_GLOSSARY_TERM_${numKey}`) }
  declareIncompletePattern() { return keyFromMap('EDITOR', 'DECLARE_INCOMPLETE'); }
  visualizeSpacesPattern() { return keyFromMap('EDITOR', 'VISUALIZE_SPACES'); }
  machineTranslation() { return keyFromMap('EDITOR', 'MACHINE_TRANSLATION'); }
}
