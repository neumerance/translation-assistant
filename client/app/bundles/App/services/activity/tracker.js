import * as _ from 'lodash';
import moment from 'moment';
import * as c from './constants';

export default class ActivityTracker {

  track(activity = 0, data = {}, store = false) {
    const self = this;
    const activityName = `activity_${activity}`;
    let unStoredData = self.getUnStoredData(activityName);
    if (store && !unStoredData) return;
    if (unStoredData) {
      unStoredData.updated_at = moment().format('YYYY-MM-DD HH:mm:ss');
    } else {
      unStoredData = { created_at: moment().format('YYYY-MM-DD HH:mm:ss') }
    }
    unStoredData.activity_type = activity;
    _.forEach(data, (value, key) => {
      unStoredData[key] = value;
    });
    if (store) {
      self.storeData(activityName, unStoredData);
    } else {
      self.setUnStoredData(activityName, unStoredData);
    }
  }

  trackSentenceActivity(cmsData, app, originalString, exitStatus = 'save') {
    const self = this;
    const wrapper = jQuery('<div>').html(originalString);
    self.track(c.SENTENCE_ACTIVITY, {exit_status: exitStatus}, true);
    const params = self.defaultParams(cmsData, app);
    params.x_count = wrapper.find('img').length;
    params.g_count = wrapper.find('span').length;
    params.short_message = 'sentence_analytics'
    self.track(c.SENTENCE_ACTIVITY, params);
  }

  trackCmsJobActivity(cmsData, app) {
    const self = this;
    const params = self.defaultParams(cmsData, app);
    params.short_message = 'job_analytics';
    self.track(c.CMS_JOB_ACTIVITY, params);
  }

  defaultParams(cmsData, app) {
    return {
      user_id: CURRENT_USER.id,
      job_id: cmsData.id,
      client_id: null,
      website_id: cmsData.website.id,
      source_language: cmsData.source_language.name,
      target_language: cmsData.target_language.name,
      spellchecker_status: !jQuery('#spellCheckerToggle').find('input').is(':checked'),
      sentences_count: cmsData.content.length,
      word_count: cmsData.word_count,
      job_type: app.params.type,
    }
  }

  setUnStoredData(activityName = '', data = {}) {
    localStorage.setItem(activityName, JSON.stringify(data));
  }

  getUnStoredData(activityName = '') {
    let data = localStorage.getItem(activityName);
    if (!data) return null;
    return JSON.parse(data);
  }

  storeData(activityName = '', data = {}) {
    let storedData = localStorage.getItem('storedData');
    if (storedData) {
      storedData = JSON.parse(storedData).data;
    } else {
      storedData = [];
    }
    storedData.push(data);
    localStorage.setItem('storedData', JSON.stringify({data: storedData}));
    localStorage.removeItem(activityName);
  }

}

export const trackerConstants = c;