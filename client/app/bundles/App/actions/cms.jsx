import Notify from '../constants/notify'
import {objectToQueryString} from '../services/utils/app_constants';
import Request, {SpellCheckRequest} from '../constants/request'
import {Base64} from 'js-base64'
import Xliffer from '../constants/xliffer'
export const notify = new Notify()
const request = new Request()
const spellCheckRequest = new SpellCheckRequest()
const xliffer = new Xliffer()
import escapeStringRegexp from 'escape-string-regexp';
import {cleanString} from '../constants/color'

export function getCmsJobs(type, page) {
  return function (dispatch) {
    request.get(`jobs?type=${type}&page=${page}`, {}, (response) => {
      if (type == 'open') {
        dispatch({type: 'STORE_OPEN_CMS_JOBS', payload: response.data})
      } else if (type == 'completed') {
        dispatch({type: 'STORE_COMPLETED_CMS_JOBS', payload: response.data})
      } else if (type == 'reviews') {
        dispatch({type: 'STORE_REVIEWS_CMS_JOBS', payload: response.data})
      } else if (type == 'waiting_for_review') {
        dispatch({type: 'STORE_WAITING_FOR_REVIEW_CMS_JOBS', payload: response.data})
      } else if (type == 'review_completed') {
        dispatch({type: 'STORE_REVIEW_COMPLETED_CMS_JOBS', payload: response.data})
      }
    })
  }
}

export function unmountCmsJob() {
  return function (dispatch) {
    dispatch({type: 'STORE_CMS_JOB', payload: {}})
  }
}

export function storeXliff(xliffJson) {
  return function (dispatch) {
    dispatch({type: 'STORE_XLIFF', payload: xliffJson})
  }
}

export function updateCurrentJob(currentCmsJob) {
  return function (dispatch) {
    dispatch({type: 'STORE_CMS_JOB', payload: null})
    dispatch({type: 'STORE_CMS_JOB', payload: currentCmsJob})
  }
}


export function getCmsJob(id) {
  return function (dispatch) {
    request.get(`jobs/${id}`, {}, (response) => {
      const xliff = Base64.decode(response.data.content)
      const xliffJson = xliffer.parseStringXliff2Json(xliff)
      response.data['xliff'] = xliffJson
      dispatch({type: 'STORE_CMS_JOB', payload: response.data})
    })
  }
}

export function saveCmsJob(params, status, callback = (notif) => {}) {
  return function (dispatch) {
    request.post(`jobs/${params.id}/save`, params, (response) => {
      let notif = null;
      if (response && status == 2) {
        if (response.data.code != 200) {
          notif = {level: 'error', title: 'Failed', message: response.data.message}
        } else {
          notif = {level: 'success', title: 'Success', message: 'Translation has been saved.'}
        }
      }
      callback(notif);
    }, false)
  }
}

export function declareAsComplete(params, router) {
  return function (dispatch) {
    request.post(`jobs/${params.id}/complete`, params, (response) => {
      if (response) {
        if (response.data.code != 200) {
          notify.error('Cannot finish this job', response.data.message, true, '.declareCompleteBtn')
        } else {
          notify.success('Success', response.data.message ? response.data.message : 'Translation completed.');
          router.push('cms/');
        }
      }
    }, false)
  }
}

export function getGlossary(cmsRequestId) {
  return function (dispatch) {
    dispatch({type: 'SET_GLOSSARY', payload: []})
    request.get(`/glossaries?cms_request_id=${cmsRequestId}`, {}, (response) => {
      dispatch({type: 'SET_GLOSSARY', payload: response.data})
    }, false)
  }
}

export function createGlossary(cmsRequestId, params, successCallback = () => {}) {
  return function (dispatch) {
    request.post(`/glossaries?cms_request_id=${cmsRequestId}`, params, (response) => {
      console.log('response', response);
      if (response.data.code) {
        if (response.data.code != 200) {
          notify.error('Failed', response.data.message)
        }
      } else {
        notify.success('Success', 'Term has been added.')
      }
      successCallback();
    }, false)
  }
}

const nullFunc = () => {
};
export function updateGlossaryItem(id, params, onSuccess = nullFunc, onError = nullFunc, onComplete = nullFunc) {
  return () => {
    request.put(`/glossaries/${ id }`, params, (response) => {
      console.log('response', response);
      if (response.data.code) {
        if (response.data.code != 200) {
          notify.error('Failed', response.data.message);
          onError(response)
        } else {
          onSuccess(response)
        }
      } else {
        notify.success('Success', 'Term has been added.')
      }
      onComplete(response)
    }, false)
  }
}

export function resetGlossary() {
  return function (dispatch) {
    dispatch({type: 'SET_GLOSSARY', payload: []})
  }
}

export function setCmsProgress(progress) {
  return function (dispatch) {
    dispatch({type: 'SET_PROGRESS', payload: progress})
  }
}

export function fetchCmsIssues(cmsId, params) {
  return function (dispatch) {
    request.get(`jobs/${cmsId}/webta_issues/get_by_mrk?${$.param(params)}`, {}, (response) => {
      if (response.data) {
        if (response.data.code && response.data.code != 200) {
          notify.error('Failed', response.data.message)
        } else {
          dispatch({type: 'SET_CMS_ISSUES', payload: response.data});
        }
      }
    })
  }
}

export function createCmsIssues(cmsId, createParams, fetchParams, callback = () => {}) {
  return function (dispatch) {
    request.post(`jobs/${cmsId}/webta_issues/create_issue_by_mrk`, createParams, (response) => {
      if (response) {
        if (response.data.code && response.data.code != 200) {
          notify.error('Failed', response.data.message);
        } else {
          request.get(`jobs/${cmsId}/webta_issues/get_by_mrk?${$.param(fetchParams)}`, {}, (response) => {
            if (response.data) {
              if (response.data.code && response.data.code != 200) {
                notify.error('Failed', response.data.message)
              } else {
                dispatch({type: 'SET_CMS_ISSUES', payload: response.data});
              }
              callback();
            }
          })
          notify.success('Success', 'Issue has been sent.');
        }
      }
    })
  }
}

export function getCmsIssueCount(cmsRequestId) {
  return (dispatch) => {
    request.get(`/jobs/${cmsRequestId}/webta_issues`, {}, (response) => {
      if (response.data) {
        if (response.data.code && response.data.code != 200) {
          notify.error('Failed', response.data.message)
        } else {
          dispatch({type: 'STORE_CMS_ISSUES_COUNT', payload: response.data});
        }
      }
    })
  }
}

export function resolveCmsIssue(cmsRequestId, issueId, successCallback = () => {}) {
  return (dispatch) => {
    request.post(`/jobs/${cmsRequestId}/webta_issues/${issueId}/close_issue`, {}, (response) => {
      if (response.data) {
        if (response.data.code && response.data.code != 200) {
          notify.error('Failed', response.data.message)
        } else {
          successCallback();
          notify.success('Success', 'Issue has been resolved.');
        }
      }
    })
  }
}

export function spellcheckSentence(langIso, sentence, callback = (langIso, data) => {}) {
  return (dispatch) => {
    const invalid_chars = new RegExp("[" + escapeStringRegexp("[\^$.|?*+(){#") + "]", 'ig');
    const data = new FormData();
    const html_regex = /(<([^>]+)>)/ig;
    const cleanedString = cleanString(
      sentence.replace(/\d+/g, ' ')
        .replace(html_regex, ' ')
        .replace(/[`~!@#$%^*()_|+\-=?:'",.<>\{\}\[\]\\\/]/gi, ' ')
        .replace(invalid_chars, ' ')
    );
    data.append('lang', langIso);
    data.append('driver', 'pspell');
    data.append('action', 'get_incorrect_words');
    data.append('text[]', cleanedString);
    spellCheckRequest.post('/SpellChecker.php', data, (response) => {
      if (response.data.outcome == 'success') {
        const data = response.data.data[0];
        if (data) {
          dispatch({type: 'SET_SPELLCHECK_CONFLICTS', payload: data});
        }
        callback(langIso, data);
      }
    }, false);
  }
}

export function updateSpellcheckWordList(data) {
  return (dispatch) => {
    dispatch({type: 'SET_SPELLCHECK_CONFLICTS', payload: data});
  }
}

export function spellcheckWordSuggestions(langIso, word, callback = () => {}) {
  return (dispatch) => {
    const data = new FormData();
    data.append('lang', langIso);
    data.append('driver', 'pspell');
    data.append('action', 'get_suggestions');
    data.append('word', word);
    spellCheckRequest.post('/SpellChecker.php', data, (response) => {
      if (response.data) {
        const suggestionsLimit = 8;
        const suggestions = (response.data || []).slice(0, suggestionsLimit);
        dispatch({type: 'SET_SPELLCHECK_SUGGESTIONS', payload: suggestions});
        callback();
      }
    }, false);
  }
}

export function getCmsTranslationPreview(cmsId) {
  return function (dispatch) {
    request.get(`jobs/${cmsId}/preview`, {}, (response) => {
      if (response) {
        dispatch({type: 'SET_CMS_PREVIEW', payload: response.data});
      }
    })
  }
}