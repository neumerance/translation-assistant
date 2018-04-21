import * as _ from 'lodash';

export default class AteHandleFallBackRedirect {

  execute(options = {}) {
    this.options = options;
    this.handleApiExceptionRedirect();
  }

  handleApiExceptionRedirect() {
    const params = {};
    const message = _.get(this.options, 'data.message') || _.get(this.options, 'statusText');
    const url = this.getFallbackUrl();
    if (message) params['redirect_message'] = message;
    const stringParams = $.param(params);
    if (url && (this.options.status === 401)) window.location = `${url}?${stringParams}`;
  }

  getFallbackUrl() {
    return localStorage.getItem('ateFallBackUrl');
  }

  setFallbackUrl(cmsData) {
    const url = _.get(cmsData, 'back_to_ate_url', null);
    if (url) localStorage.setItem('ateFallBackUrl', url);
  }

}
