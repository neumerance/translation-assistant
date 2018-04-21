import axios from 'axios';
import * as c from './constants';
import ActivityTracker from './tracker';

export default class ActivityCommitter {

  init() {
    const self = this;
    this.commitAllBeforeLeaving();
    setInterval(() => {
      self.commit();
    }, 20000)
  }

  storeAll() {
    const tracker = new ActivityTracker();
    tracker.track(c.CMS_JOB_ACTIVITY, {}, true);
    tracker.track(c.SENTENCE_ACTIVITY, { exit_status: 'save' }, true);
  }

  storeAndCommitAll() {
    this.storeAll();
    this.commit();
  }

  commit() {
    const self = this;
    let storedData = localStorage.getItem('storedData');
    if (storedData) {
      storedData = JSON.parse(storedData).data;
      if (storedData) {
        self.doRequest('/activities', 'post', { activities: storedData }, (response) => {
          if (response.status == 200) {
            localStorage.removeItem('storedData');
          }
        });
      }
    }
  }

  commitAllBeforeLeaving() {
    const self = this;
    const target = jQuery(window);
    target.on('beforeunload', () => {
      self.storeAll();
      self.commit();
    });
  }

  doRequest(url = '', type = 'get', data = {}, callback = c.NULL_FUNC) {
    axios({
      method: type,
      url: url,
      data: data
    }).then((response) => {
      if (response.data) {
        callback(response.data);
      }
    });
  }

}