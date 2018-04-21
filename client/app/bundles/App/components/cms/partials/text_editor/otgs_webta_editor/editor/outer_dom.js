export default class OtgsWebtaEditorOuterDom {
  constructor(uniqueId, controller) {
    this.uniqueId = uniqueId;
    this.controller = controller;
    this.editorCssId = `otgs-editor-${this.uniqueId}`;
    this.previewCssId = `editor-preview-${this.uniqueId}`;
    this.toolContainerCssId = `editor-tool-container-${this.uniqueId}`;
  }

  setPreviewContent(content) {
    $('#'+`${this.previewCssId} > p`).html(content);
  }

  expandEditor() {
    this.controller.init();
    if($('#' + `${this.previewCssId}.collapsed`).length > 0) return false;

    $('.editor-preview.collapsed').removeClass('collapsed').addClass('expanded');
    const $expandedEditors = $('.editor-tool-container.expanded');

    const expandCurrentEditor = ()=> {
      $(`.editor-tool-container.expanded`).removeClass('expanded').addClass('collapsed').attr('style', '');
      $('#' + `${this.previewCssId}`).removeClass('expanded').addClass('collapsed');

      const $thisEditor = $('#' + `${this.toolContainerCssId}`);

      $thisEditor.slideDown('fast', () => {
        $thisEditor.removeClass('collapsed').addClass('expanded');
        $(`.editor-preview:not(#${this.previewCssId})`).removeClass('collapsed').addClass('expanded');
        $(`.editor-tool-container:not(#${this.toolContainerCssId})`).removeClass('expanded').addClass('collapsed').attr('style', '');

        this.controller.focusWithCursorOnLastCharacter();
      });
    };

    if($expandedEditors.length > 0) {
      $expandedEditors.slideUp('fast', expandCurrentEditor);
    } else {
      expandCurrentEditor();
    }
    return true;
  }
}
