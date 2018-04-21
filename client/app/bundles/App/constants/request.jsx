import {api, spellcheckapi} from '../services/utils/app_constants';
import * as _ from 'lodash';
import ActivityTracker from '../services/activity/tracker';
import ActivityCommitter from '../services/activity/committer';
import HandleFallBackRedirect from '../adapters/core/handle_fallback_redirect';

export default class Request {
  constructor() {
    this.api = api;
  }

  get(url, params = {}, func = (response) => {
  }, preload = true) {
    this.request_do('get', url, params, func, preload)
  }

  post(url, params = {}, func = (response) => {
  }, preload = true) {
    this.request_do('post', url, params, func, preload)
  }

  put(url, params = {}, func = (response) => {
  }, preload = true) {
    this.request_do('put', url, params, func, preload)
  }

  request_do(method, url, params, func, preload) {
    if (preload) $('div#preloader').show();
    this.api({
      url: url,
      data: params,
      method: method
    }).then(function (response) {
      if (_.keys(response.data).length) {
        if (preload) $('div#preloader').hide();
        func(response);
      }
    }).catch(err => {
      console.log('err', err);
      const error = { stacktrace: err };
      if (_.get(err, 'response.status', null) === 401) _.set(err, 'response.statusText', 'Our session has expired, please login again');
      error.tag = 'exception';
      error.short_message = 'api_exception';
      new HandleFallBackRedirect().execute(err.response);
      new ActivityTracker().storeData('', error);
      new ActivityCommitter().storeAndCommitAll();
    });
  }

}

export class SpellCheckRequest extends Request {

  constructor() {
    super();
    this.api = spellcheckapi;
  }

}