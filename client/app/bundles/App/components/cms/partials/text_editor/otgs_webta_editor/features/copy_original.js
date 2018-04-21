export default class FeatureCopyOriginal {
  constructor(controller, containerProps) {
    this.controller = controller;
    this.containerProps = containerProps;
  }

  execute() {
    const self = this;
    const value = self.containerProps.originalString;

    self.controller.setContent(value);
    self.controller.outerDom.setPreviewContent(value);
    self.containerProps.updateStatus(self.containerProps.mrkIndex, 1, value);
  }
}