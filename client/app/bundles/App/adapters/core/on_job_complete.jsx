import {IclOnJobComplete} from '../external/icl/on_job_complete';
import {AteOnJobComplete} from '../external/ate/on_job_complete';

export class OnJobComplete {
  execute(options){
    if(ApplicationAdapters.config.targetApp === 'icl') {
      new IclOnJobComplete().execute(options);
    }
    if(ApplicationAdapters.config.targetApp === 'ate') {
      new AteOnJobComplete().execute(options);
    }
  }
}
