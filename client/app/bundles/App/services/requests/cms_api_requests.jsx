import Request from '../../constants/request';
const request = new Request()
import Notify from '../../constants/notify';
export const notify = new Notify();
import * as messages from '../../constants/app_messages';
import {OnJobComplete} from '../../adapters/core/on_job_complete';
import HandleFallBackRedirect from '../../adapters/core/handle_fallback_redirect';

export default class CmsApiRequests {

  constructor(app) {
    this.app = app;
    this.api = new Request();
  }

  getCmsJobs(params = {}, callback = (data) => {}, preload = false) {
    let result = {};
    request.get(`jobs?${$.param(params)}`, {}, (response) => {
      if (response.data) result = response.data;
      callback(result);
    }, preload);
  }

  getCmsDetails(cmsId, params, callback = (mrks) => {} ) {
    request.get(`jobs/${cmsId}?version=2&${jQuery.param(params)}`, params, (response) => {
      let mrks = [];
      let cmsData = null;
      if (response.data) {
        if (Array.isArray(response.data.content)) mrks = response.data.content;
        cmsData = response.data;
        new HandleFallBackRedirect().execute({ cmsData: cmsData });
      } else {
        notify.error('Request Error', messages.ERROR_JOB_DETAILS);
      }
      callback({
        mrks: mrks,
        cmsData: cmsData
      });
    }, false)
  }

  getCmsPreview(cmsId, callback = (content) => {}) {
    let content = '';
    request.get(`jobs/${cmsId}/preview`, {}, (response) => {
      if (response.data) content = response.data;
      callback(content);
    }, false)
  }

  saveCmsJob(params, status, callback = (notif) => {}) {
    request.post(`jobs/${params.id}/save`, params, (response) => {
      let notif = null;
      if (response && status == 2) {
        if (response.data.code != 200) {
          notif = {level: 'error', title: 'Failed', message: response.data.message}
        } else {
          notif = {level: 'success', title: 'Success', message: messages.TRANSLATION_SAVED}
        }
      }
      callback(notif);
    }, false);
  }

  declareAsComplete(cmsId, app, callback = () => {}) {
    request.post(`jobs/${cmsId}/complete`, {}, (response) => {
      if (response.data) {
        if (response.data.code != 200) {
          notify.error('Cannot finish this job', response.data.message);
        } else {
          new OnJobComplete().execute({app: app, response: response.data});
          notify.success('Success', response.data.message);
        }
      }
    }, true);
  }

}
