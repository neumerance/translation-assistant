export class AteOnJobComplete {
  execute(options){
    window.location = options.response.continue_to;
  }
}
