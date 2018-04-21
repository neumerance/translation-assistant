export default class FeaturesNavigation {
  currentContainer() {
    const $expandedEditor = $(`.otgs-webta-editor-container .editor-tool-container.expanded`);
    let $currentContainer = $expandedEditor.parents('.otgs-webta-editor-container');

    if($currentContainer.length === 0) {
      $currentContainer = $(`.otgs-webta-editor-container:first`)
    }
    return $currentContainer;
  }

  nextContainer() {
    return this.currentContainer().parents('.vertical-table').next().find('.otgs-webta-editor-container');
  }

  prevContainer() {
    return this.currentContainer().parents('.vertical-table').prev().find('.otgs-webta-editor-container');
  }

  collapseAllSentences() {
    $(`.editor-tool-container`).removeClass('expanded').addClass('collapsed').attr('style', '');
    $(`.editor-preview`).removeClass('collapsed').addClass('expanded');
  }

  nextSentence() {
    const $container = this.nextContainer();
    let action;
    if($container.length === 0) {
      action = ()=> { this.collapseAllSentences() };
    } else {
      action = ()=> {
        const $preview = $container.find('.editor-preview');
        this.openSentence($preview);
      }
    }
    setTimeout(action, 0);
  }

  openSentence($preview) {
    if($preview.length === 0) $preview = $('.editor-preview:first');
    $preview.trigger('click');
    const time = 300;
    const headerOffset = 290;
    $('body').animate({scrollTop: ($preview.offset().top - headerOffset)}, time);
  }

  prevSentence() {
    const action = ()=> {
      const $preview = this.prevContainer().find('.editor-preview');
      this.openSentence($preview);
    };
    setTimeout(action, 0);
  }

  saveSentence() {
    $('.save-sentence-btn:visible').trigger('click')
  }

  incompleteSentence() {
    $('.declare-incomplete-btn:visible').trigger('click')
  }

  createSentenceIssue() {
    $('.new-issue-btn:visible').trigger('click')
  }

  resetToOriginal() {
    $('.reset-btn:visible').trigger('click')
  }

  machineTranslation() {
    $('.machine-translation-btn:visible').trigger('click')
  }

  previewJob() {
    $('.preview-job-btn:visible').trigger('click')
  }

  completeJob() {
    $('.complete-job-btn:visible').trigger('click')
  }

  backToEditor() {
    $('.back-to-editor-btn:visible').trigger('click')
  }

  toggleSentenceGlossary() {
    $('.toggle-glossary-btn:visible').trigger('click')
  }

  toggleGlobalGlossary() {
    $('.global-glossary-btn:visible').trigger('click')
  }

  visualizeSpaces() {
    $('.visualize-spaces-btn:visible').trigger('click')
  }
}
