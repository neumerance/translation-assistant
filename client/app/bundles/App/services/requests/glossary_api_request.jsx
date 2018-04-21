import Request from '../../constants/request';
const request = new Request()
import Notify from '../../constants/notify';
export const notify = new Notify();
import * as messages from '../../constants/app_messages';

const nullFunc = () => {
};

export default class GlossaryApiRequests {

  getAllGlossaries(cmsId, callback = nullFunc) {
    const self = this;
    request.get(`/glossaries?cms_request_id=${cmsId}`, {}, (response) => {
      if (self.failedResponse(response)) return;
      callback(response);
    }, false);
  }

  createGlossary(cmsRequestId, params, callback = nullFunc) {
    const self = this;
    request.post(`/glossaries?cms_request_id=${cmsRequestId}`, params, (response) => {
      if (self.failedResponse(response)) return;
      callback(response);
    }, false)
  }

  getGlossary(cmsRequestId, callback = nullFunc) {
    const self = this;
    request.get(`/glossaries?cms_request_id=${cmsRequestId}`, {}, (response) => {
      if (self.failedResponse(response)) return;
      callback(response);
    }, false)
  }

  updateGlossaryItem(id, params, callback = nullFunc) {
    const self = this;
    request.put(`/glossaries/${ id }`, params, (response) => {
      if (self.failedResponse(response)) return;
      callback(response);
    }, false)
  }

  failedResponse(response) {
    if (response.status != 200) {
      notify.error('Failed', messages.GENERIC_ERROR);
      return true;
    }
  }

}