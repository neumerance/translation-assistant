import Request from '../../constants/request';
const request = new Request()
import Notify from '../../constants/notify';
export const notify = new Notify();
import * as messages from '../../constants/app_messages';

export default class IssueApiRequests {

  getCmsIssueCount(cmsId, callback = (content) => {}) {
    let data = {};
    request.get(`/jobs/${cmsId}/webta_issues`, {}, (response) => {
      if (response.data) {
        (response.data.code && response.data.code != 200) ? notify.error('Failed', response.data.message) : data = response.data;
      }
      callback(data);
    }, false)
  }

  createCmsIssues(cmsId, params, callback = () => {}) {
    request.post(`jobs/${cmsId}/webta_issues/create_issue_by_mrk`, params, (response) => {
      if (response.data) {
        if (response.data.code && response.data.code != 200) {
          notify.error('Failed', 'Something went wrong, please try again.')
        } else {
          callback();
        }
      }
    }, false);
  }

  fetchCmsIssues(cmsId, params, callback = (data) => {}) {
    let data = [];
    request.get(`jobs/${cmsId}/webta_issues/get_by_mrk?${$.param(params)}`, {}, (response) => {
      if (response.data) {
        if (response.data.code && response.data.code != 200) {
          notify.error('Failed', response.data.message)
        } else {
          data = response.data;
        }
        callback(data);
      }
    }, false);
  }

  resolveCmsIssue(cmsRequestId, issueId, callback = () => {}) {
    request.post(`/jobs/${cmsRequestId}/webta_issues/${issueId}/close_issue`, {}, (response) => {
      if (response.data) {
        if (response.data.code && response.data.code != 200) {
          notify.error('Failed', response.data.message);
        } else {
          callback();
          notify.success('Success', messages.RESOLVED_ISSUE);
        }
      }
    }, false)
  }

}