import FeatureSaveSentence from './save_sentence';
import FeaturesNavigation from './navigation';

export default class FeatureSaveIncompleteSentence {
  constructor(controller, containerProps, toolbarProps) {
    this.controller = controller;
    this.props = containerProps;
    this.toolbarProps = toolbarProps;
  }

  execute() {
    new FeatureSaveSentence(this.controller, this.props, this.toolbarProps).saveSentence(1)
    new FeaturesNavigation().nextSentence()
  }
}
