import $ from 'jquery';
const nullFunc = ()=> {};

const JestSupportConfig = {
  setGlobals: ()=> {
    JestSupportConfig.setGlobalData();
    JestSupportConfig.setLibs();
  },

  setGlobalData: ()=> {
    global.ApplicationAdapters = {
      config: {  }
    };
    global.CURRENT_USER = {};
    global.PureLocalizationDB = {
      data: {}
    };
  },

  setLibs: ()=> {
    global.$ = $;
    global.$.notifyDefaults = nullFunc;
    global.tinymce = { init: nullFunc };
  }
};
export default JestSupportConfig;

