import IclHandleFallBackRedirect from '../external/icl/handle_fallback_redirect';
import AteHandleFallBackRedirect from '../external/ate/handle_fallback_redirect';

export default class HandleFallBackRedirect {
  
  execute(options){
    if(ApplicationAdapters.config.targetApp === 'icl') {
      new IclHandleFallBackRedirect().execute(options);
    }
    if(ApplicationAdapters.config.targetApp === 'ate') {
      new AteHandleFallBackRedirect().execute(options);
    }
  }

  getBackToListUrl() {
    return (ApplicationAdapters.config.targetApp === 'ate') ? new AteHandleFallBackRedirect().getFallbackUrl() : '/dashboard#/';
  }
 
}