import axios from "axios";
import ActivityTracker from '../../../../../../services/activity/tracker';
import ActivityCommitter from '../../../../../../services/activity/committer';

const nullFunc = (response) => {};

export default class FeatureMachineTranslation {
  constructor(controller, containerProps) {
    this.controller = controller;
    this.containerProps = containerProps;
    this.api = axios.create({
      baseURL: '',
      timeout: 180000
    });
  }

  request(successCallback = nullFunc) {
    const self = this;
    const cmsData = this.containerProps.cmsData;
    self.api({
      url: '/machine_translation/translate',
      data: { 
        translate: {
          from_lang: cmsData.source_language.iso,
          to_lang: cmsData.target_language.iso,
          string: self.containerProps.originalString
        }
      },
      method: 'post'
    }).then(function (response) {
      if (response.data.status === 200) {
        successCallback(response.data);
      } else {
        self.onError(response.data);
      }
    }).catch((response)=> {
      self.onError({ data: response });
    });
  }

  onError(response) {
    if (response.data.message) {
      response.data.tag = 'exception';
      response.data.short_message = 'api_exception';
      response.data.exception_message = response.data.message;
      new ActivityTracker().storeData('', response.data);
      new ActivityCommitter().storeAndCommitAll();
    }
  }

  execute() {
    const self = this;
    self.controller.disableEditor();
    self.request((response) => {
      self.controller.setContent(response.data);
      self.controller.outerDom.setPreviewContent(response.data);
      self.controller.enableEditor();
    });
  }
}