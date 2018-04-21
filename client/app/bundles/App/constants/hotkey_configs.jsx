import * as _ from 'lodash';

const keyMap = {
  EDITOR: {
    NEXT_SENTENCE: 'ctrl+down',
    PREV_SENTENCE: 'ctrl+up',
    SAVE_SENTENCE: 'ctrl+enter',
    CLEAR_TRANSLATION: 'alt+delete',
    INSERT_MARKER_1: 'alt+1',
    INSERT_MARKER_2: 'alt+2',
    INSERT_MARKER_3: 'alt+3',
    INSERT_MARKER_4: 'alt+4',
    INSERT_MARKER_5: 'alt+5',
    INSERT_MARKER_6: 'alt+6',
    INSERT_MARKER_7: 'alt+7',
    INSERT_MARKER_8: 'alt+8',
    INSERT_MARKER_9: 'alt+9',
    INSERT_MARKER_0: 'alt+0',
    INSERT_XTAG_TOKEN_1: 'ctrl+alt+1',
    INSERT_XTAG_TOKEN_2: 'ctrl+alt+2',
    INSERT_XTAG_TOKEN_3: 'ctrl+alt+3',
    INSERT_XTAG_TOKEN_4: 'ctrl+alt+4',
    INSERT_XTAG_TOKEN_5: 'ctrl+alt+5',
    INSERT_XTAG_TOKEN_6: 'ctrl+alt+6',
    INSERT_XTAG_TOKEN_7: 'ctrl+alt+7',
    INSERT_XTAG_TOKEN_8: 'ctrl+alt+8',
    INSERT_XTAG_TOKEN_9: 'ctrl+alt+9',
    INSERT_XTAG_TOKEN_0: 'ctrl+alt+0',
    CREATE_VIEW_SENTENCE_ISSUE: 'ctrl+alt+i',
    RESET_TO_ORIGINAL: 'alt+insert',
    DECLARE_JOB_AS_COMPLETE: 'ctrl+alt+enter',
    SWITCH_PREVIEW: 'ctrl+alt+p',
    SWITCH_TRANSLATE: 'ctrl+alt+t',
    TOGGLE_SENTENCE_GLOSSARY: 'alt+shift+g',
    TOGGLE_GLOBAL_GLOSSARY: 'alt+ctrl+g',
    INSERT_GLOSSARY_TERM_1: 'alt+shift+1',
    INSERT_GLOSSARY_TERM_2: 'alt+shift+2',
    INSERT_GLOSSARY_TERM_3: 'alt+shift+3',
    INSERT_GLOSSARY_TERM_4: 'alt+shift+4',
    INSERT_GLOSSARY_TERM_5: 'alt+shift+5',
    INSERT_GLOSSARY_TERM_6: 'alt+shift+6',
    INSERT_GLOSSARY_TERM_7: 'alt+shift+7',
    INSERT_GLOSSARY_TERM_8: 'alt+shift+8',
    INSERT_GLOSSARY_TERM_9: 'alt+shift+9',
    INSERT_GLOSSARY_TERM_0: 'alt+shift+0',
    DECLARE_INCOMPLETE: 'alt+shift+i',
    MACHINE_TRANSLATION: 'alt+ctrl+m',
    VISUALIZE_SPACES: 'alt+p',
    MACHINE_TRANSLATION: 'ctrl+m'
  }
}

export default keyMap;

export const shortcutKeyToClass = (key) => {
  return key ? key.split('+').join('_') : '';
}

export const execInsertMarker = (id) => {
  $(`.insertMarker_${id}`).trigger('click');
}

export const execInsertXtagToken = (id) => {
  $(`.insertXtagToken_${id}`).trigger('click');
}

export const hasFKeys = (keys) => {
  if (!keys.length) return false;
  return Array.isArray(keys.match(/f[0-9]/ig));
}

export const hasNumKeys = (keys) => {
  return Array.isArray(keys.match(/[0-9]/ig))
}

export const getFKeysNum = (keys) => {
  return hasFKeys(keys) ? keys.match(/[0-9]/ig).join('') : null;
}

export const getNumKeys = (keys) => {
  if (!hasFKeys(keys) && hasNumKeys(keys)) return keys.match(/[0-9]/ig).join('');
}

export const triggerButton = (key) => {
  const classKey = shortcutKeyToClass(key);
  const elem = $(`.${classKey}:visible`);
  console.log('found?', elem.length);
  elem.trigger('click');
}

export const isAKeyCodeShortCut = (keys) => {
  const keyLists = _.map(keyMap['EDITOR'], (keyCode, key) => { return keyCode });
  const keyName = keys.join('+');
  return _.includes(keyLists, keyName);
}

export const keyFromMap = (namespace, key) => {
  const keyCode = (keyMap[namespace]  || {})[key];
  return keyCode;
}

export const keyLabelFromMap = (namespace, key) => {
  const keyCode = keyFromMap(namespace, key);
  return keyCode.split('+').map((str) => {return _.capitalize(str)}).join('+');
}