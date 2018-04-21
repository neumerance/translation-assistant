import axios from 'axios'
import {cleanString} from '../../constants/color';

export const api = axios.create({
  baseURL: API_ENDPOINT + '/api/',
  timeout: 180000,
  headers: {'Authorization': SESSION_TOKEN}
});

export const spellcheckapi = axios.create({
  baseURL: PSPELL_API,
  timeout: 180000,
  headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
});

export const iso_lang = {
  "en": "English",
  "es": "Spanish",
  "de": "German",
  "fr": "French",
  "ar": "Arabic",
  "bs": "Bosnian",
  "bg": "Bulgarian",
  "ca": "Catalan",
  "cs": "Czech",
  "cu": "Slovak",
  "cy": "Welsh",
  "da": "Danish",
  "el": "Greek",
  "eo": "Esperanto",
  "et": "Estonian",
  "eu": "Basque",
  "fa": "Persian",
  "fi": "Finnish",
  "ga": "Irish",
  "he": "Hebrew",
  "hi": "Hindi",
  "hr": "Croatian",
  "hu": "Hungarian",
  "hy": "Armenian",
  "id": "Indonesian",
  "is": "Icelandic",
  "it": "Italian",
  "ja": "Japanese",
  "ko": "Korean",
  "ku": "Kurdish",
  "la": "Latin",
  "lv": "Latvian",
  "lt": "Lithuanian",
  "mk": "Macedonian",
  "mt": "Maltese",
  "mo": "Moldavian",
  "mn": "Mongolian",
  "ne": "Nepali",
  "nl": "Dutch",
  "nb": "Norwegian",
  "pa": "Panjabi",
  "pl": "Polish",
  "pt-BR": "Portuguese",
  "qu": "Quechua",
  "ro": "Romanian",
  "ru": "Russian",
  "sl": "Slovenian",
  "so": "Somali",
  "sq": "Albanian",
  "sr": "Serbian",
  "sv": "Swedish",
  "ta": "Tamil",
  "th": "Thai",
  "tr": "Turkish",
  "uk": "Ukrainian",
  "ur": "Urdu",
  "uz": "Uzbek",
  "vi": "Vietnamese",
  "yi": "Yiddish",
  "zh-Hans": "Chinese (Simplified)",
  "zu": "Zulu",
  "zh-Hant": "Chinese (Traditional)",
  "pt-PT": "Portugal Portuguese",
  "kk-KK": "Kazakh",
  "ms": "Malay",
  "tl_PH": "Tagalog",
  "af": "Afrikaans",
  "mm": "Burmese",
  "kh": "Cambodian",
  "sw": "Swahili",
  "gd": "Irish Gaelic",
  "am": "Amharic",
  "yr": "Yoruba",
  "lg": "Lingala",
  "ka": "Georgian",
  "bn": "Bengali",
  "ha": "Gujarati",
  "mr": "Marathi",
  "te": "Telugu",
  "kn": "Kannada",
  "ml": "Malayalam",
  "dr": "Dari",
  "ti": "Tigrinya",
  "bho": "Bhojpuri",
  "az": "Azeerbaijani",
  "be": "Belarusian",
  "sn": "Shona",
  "hau": "Hausa"
}
export const iso_lang_hash = {
  '1': {name: 'English', iso: 'en'},
  '2': {name: 'Spanish', iso: 'es'},
  '3': {name: 'German', iso: 'de'},
  '4': {name: 'French', iso: 'fr'},
  '5': {name: 'Arabic', iso: 'ar', direction: 'drtl'},
  '6': {name: 'Bosnian', iso: 'bs'},
  '7': {name: 'Bulgarian', iso: 'bg'},
  '8': {name: 'Catalan', iso: 'ca'},
  '9': {name: 'Czech', iso: 'cs'},
  '10': {name: 'Slovak', iso: 'cu'},
  '11': {name: 'Welsh', iso: 'cy'},
  '12': {name: 'Danish', iso: 'da'},
  '13': {name: 'Greek', iso: 'el'},
  '14': {name: 'Esperanto', iso: 'eo'},
  '15': {name: 'Estonian', iso: 'et'},
  '16': {name: 'Basque', iso: 'eu'},
  '17': {name: 'Persian', iso: 'fa'},
  '18': {name: 'Finnish', iso: 'fi'},
  '19': {name: 'Irish', iso: 'ga'},
  '20': {name: 'Hebrew', iso: 'he', direction: 'rtl'},
  '21': {name: 'Hindi', iso: 'hi'},
  '22': {name: 'Croatian', iso: 'hr'},
  '23': {name: 'Hungarian', iso: 'hu'},
  '24': {name: 'Armenian', iso: 'hy'},
  '25': {name: 'Indonesian', iso: 'id'},
  '26': {name: 'Icelandic', iso: 'is'},
  '27': {name: 'Italian', iso: 'it'},
  '28': {name: 'Japanese', iso: 'ja'},
  '29': {name: 'Korean', iso: 'ko'},
  '30': {name: 'Kurdish', iso: 'ku'},
  '31': {name: 'Latin', iso: 'la'},
  '32': {name: 'Latvian', iso: 'lv'},
  '33': {name: 'Lithuanian', iso: 'lt'},
  '34': {name: 'Macedonian', iso: 'mk'},
  '35': {name: 'Maltese', iso: 'mt'},
  '36': {name: 'Moldavian', iso: 'mo'},
  '37': {name: 'Mongolian', iso: 'mn'},
  '38': {name: 'Nepali', iso: 'ne'},
  '39': {name: 'Dutch', iso: 'nl'},
  '40': {name: 'Norwegian', iso: 'nb'},
  '41': {name: 'Panjabi', iso: 'pa'},
  '42': {name: 'Polish', iso: 'pl'},
  '43': {name: 'Portuguese', iso: 'pt-BR'},
  '44': {name: 'Quechua', iso: 'qu'},
  '45': {name: 'Romanian', iso: 'ro'},
  '46': {name: 'Russian', iso: 'ru'},
  '47': {name: 'Slovenian', iso: 'sl'},
  '48': {name: 'Somali', iso: 'so'},
  '49': {name: 'Albanian', iso: 'sq'},
  '50': {name: 'Serbian', iso: 'sr'},
  '51': {name: 'Swedish', iso: 'sv'},
  '52': {name: 'Tamil', iso: 'ta'},
  '53': {name: 'Thai', iso: 'th'},
  '54': {name: 'Turkish', iso: 'tr'},
  '55': {name: 'Ukrainian', iso: 'uk'},
  '56': {name: 'Urdu', iso: 'ur'},
  '57': {name: 'Uzbek', iso: 'uz'},
  '58': {name: 'Vietnamese', iso: 'vi'},
  '59': {name: 'Yiddish', iso: 'yi'},
  '60': {name: 'Chinese (Simplified)', iso: 'zh-Hans'},
  '61': {name: 'Zulu', iso: 'zu'},
  '62': {name: 'Chinese (Traditional)', iso: 'zh-Hant'},
  '63': {name: 'Portugal Portuguese', iso: 'pt-PT'},
  '64': {name: 'Kazakh', iso: 'kk-KK'},
  '65': {name: 'Malay', iso: 'ms'},
  '66': {name: 'Tagalog', iso: 'tl_PH'},
  '67': {name: 'Afrikaans', iso: 'af'},
  '68': {name: 'Burmese', iso: 'mm'},
  '69': {name: 'Cambodian', iso: 'kh'},
  '70': {name: 'Swahili', iso: 'sw'},
  '71': {name: 'Irish Gaelic', iso: 'gd'},
  '72': {name: 'Amharic', iso: 'am'},
  '73': {name: 'Yoruba', iso: 'yr'},
  '74': {name: 'Lingala', iso: 'lg'},
  '75': {name: 'Georgian', iso: 'ka'},
  '76': {name: 'Bengali', iso: 'bn'},
  '77': {name: 'Gujarati', iso: 'ha'},
  '78': {name: 'Marathi', iso: 'mr'},
  '79': {name: 'Telugu', iso: 'te'},
  '80': {name: 'Kannada', iso: 'kn'},
  '81': {name: 'Malayalam', iso: 'ml'},
  '82': {name: 'Dari', iso: 'dr'},
  '83': {name: 'Tigrinya', iso: 'ti'},
  '84': {name: 'Bhojpuri', iso: 'bho'},
  '85': {name: 'Azeerbaijani', iso: 'az'},
  '86': {name: 'Belarusian', iso: 'be'},
  '87': {name: 'Shona', iso: 'sn'},
  '89': {name: 'Hausa', iso: 'hau'}
}

export const pluck = function (objects, target) {
  let result = []
  $.each(objects, function (index, object) {
    result.push(object[target])
  })
  return result
}

export const calculatePercentage = function (current, total) {
  return ((current / total) * 100).toFixed(2)
}

export const editDistance = function (str1, str2) {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();

  const costs = new Array();

  for (var i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

export const stringSimilarity = function (s1, s2) {
  let longer = s1;
  let shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  const longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

export const replaceSelectedText = (iframe, replacement) => {
  let sel, range;
  if (iframe.getSelection) {
    sel = iframe.getSelection();
    if (sel.rangeCount) {
      range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(replacement.get(0));
    }
  }
}

export const ISSUE_KINDS = [{name: 'General question', value: 'ISSUE_GENERAL_QUESTION'},
  {name: 'Original text is unclear', value: 'ISSUE_UNCLEAR_ORIGINAL'},
  {name: 'Translation suggestion', value: 'ISSUE_TRANSLATION_SUGGESTION'},
  {name: 'Incorrect translation', value: 'ISSUE_INCORRECT_TRANSLATION'}]

export const wysihtml5ParserRules = {
  classes: {
    "wysiwyg-text-align-left": 1,
    "wysiwyg-text-align-center": 1,
    "wysiwyg-text-align-right": 1,
    "wysiwyg-text-align-justify": 1,
  },
  classes_blacklist: {
    "Apple-interchange-newline": 1,
    "MsoNormal": 1,
    "MsoPlainText": 1
  },
  tags: {
    strong: {remove: 1},
    b: {remove: 1},
    i: {remove: 1},
    em: {remove: 1},
    u: {remove: 1},
    br: {remove: 1},
    p: {remove: 1},
    div: {remove: 1},
    span: {
      check_attributes: {
        style: 'allow',
        id: 'allow',
        class: 'allow'
      }
    },
    img: {
      check_attributes: {
        style: 'allow',
        src: 'allow',
        id: 'allow',
        class: 'allow'
      }
    },
    ul: {remove: 1},
    ol: {remove: 1},
    li: {remove: 1},
    h1: {remove: 1},
    h2: {remove: 1},
    h3: {remove: 1},
    h4: {remove: 1},
    h5: {remove: 1},
    comment: {remove: 1},
  }
};

export const doesContainsSingleTag = (text) => {
  const wrapper = $('<div>').html(text)
  if (wrapper.find('> g, > x').length == 1) {
    wrapper.find('> g, > x').remove()
  }
  return cleanString(wrapper.html()).length == 0
}

export const stripEncapsulingTag = (text) => {
  let result = text;
  if (doesContainsSingleTag(text) && !$(text).is('x')) {
    result = stripEncapsulingTag($(text).html());
  }
  return result;
}

export const encapsulateTag = (original, translation) => {
  const orginal_encapsulated_text = stripEncapsulingTag(original);
  return original.replace(orginal_encapsulated_text, translation);
}

export const getWordPosition = (string, substring, endLetterPos = false, forLeft = true) => {
  const index = forLeft ? string.indexOf(substring) : string.lastIndexOf(substring);
  if (index !== 1) {
    return endLetterPos ? ( index + (substring.length) ) : index;
  } else {
    return false;
  }
}

export const getHtmlOrWord = (string, substring, forLeft = true) => {
  const wrapper = $('<div>').html(string);
  const elem = wrapper.find(forLeft ? ':contains(' + substring + '):first' : ':contains(' + substring + '):last');
  const result = (elem.length && elem.text().toLowerCase() === substring.toLowerCase()) ? elem[0].outerHTML : substring;
  return result
}

export const hasSingleSpanTag = (text) => {
  let result = false;
  const wrapper = $('<div>').html(text);
  if (wrapper.find('span').length == 1) {
    wrapper.find('span').remove();
    if (!wrapper.html().length) {
      result = true;
    }
  }
  return result
}

export const returnAsSelectedString = (string, selectedString) => {
  let result = '';
  const wrapper = $('<div>').html(string);
  if (wrapper.text() !== selectedString) {
    result = returnAsSelectedString(string.slice(0, (string.length - 1)), selectedString);
  } else {
    result = string;
  }
  return result;
}

export const cleanHtmlName = (text) => {
  const arr = text.split('-');
  return arr[arr.length - 1];
}

export const generateTextImage = (text) => {
  const tCtx = document.getElementById('textCanvas').getContext('2d');
  tCtx.canvas.width = tCtx.measureText('< ' + cleanHtmlName(text) + ' >').width + 2;
  tCtx.canvas.height = 18;
  tCtx.fillText('< ' + cleanHtmlName(text) + ' />', 0, 12);
  return tCtx.canvas.toDataURL();
}
