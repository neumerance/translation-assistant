export default class IclHandleFallBackRedirect {

  execute(options = {}) {
    this.options = options;
    console.log('options', options);
    this.handleApiExceptionRedirect();
  }

  handleApiExceptionRedirect() {
    const params = {};
    console.log(this.options);
    const message = _.get(this.options, 'data.message') || _.get(this.options, 'statusText');
    const url = '/';
    if (message) params['redirect_message'] = message; 
    const stringParams = $.param(params);
    if(this.options.status === 401) window.location = `${url}?${stringParams}`;
  }

}