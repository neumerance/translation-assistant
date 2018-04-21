import OtgsWebtaEditorShortcuts from './shortcuts'
import MarkersManager from './markers_manager'
import OtgsWebtaEditorOuterDom from './outer_dom'
import {OtgsWebtaEditorVisibleSpace} from './visible_space'

global.viewSpaceMode = {};
global.controllerOptions = {};

export default class OtgsWebtaEditorController {
  constructor(uniqueId, direction){
    this.uniqueId = uniqueId;
    this.direction = direction;
    this.changeCallbacks = {};
    this.outerDom = new OtgsWebtaEditorOuterDom(uniqueId, this);
  }

  prepare(options) {
    this.setOptions(options);
    options.lastTouchedAt = new Date();
  }

  setOptions(options) {
    global.controllerOptions[this.uniqueId] = options;
  }

  getOptions() {
    return global.controllerOptions[this.uniqueId] || {}
  }

  cleanInactiveEditors() {
    const editorsLimit = 20;
    const eachUpdatedAt = (e)=>{ return e.webtaOptions.lastTouchedAt };
    const editors = tinymce.editors.map((e)=>{ return e }).sort(eachUpdatedAt);
    if(editors.length > editorsLimit) {
      const editorToRemove = editors[editors.length - 1];
      console.log('remove tinymce instance', editorToRemove.id);
      editorToRemove.remove();
    }
  }

  init() {
    const self = this;
    this.options = this.getOptions();
    this.options.lastTouchedAt = new Date();
    this.cleanInactiveEditors();

    tinymce.init({
      selector: `#${this.outerDom.editorCssId}`,
      branding: false,
      elementpath: false,
      toolbar: false,
      forced_root_block: false,
      extended_valid_elements: 'span[*],img[*]',
      statusbar: false,
      inline_boundaries: false,
      object_resizing : false,
      webta_options: this.options,
      height: '150px',
      directionality: self.direction,
      content_css: '/tinymce_extras/content.css?v=3.2',
      menu: {},
      selection_toolbar: false,
      setup: function(mceEditor) {
        mceEditor.on('keyup keydown keypress', (event) => {
          self.onKeyPress(event);

          if(event.type === 'keyup') {
            setTimeout(()=>{
              self.runChangeCallbacks();
              self.cleanColorArtifacts();
            }, 0);
          }
        });
        mceEditor.on('paste', (event) => {
          self.onPaste(event);
          self.runChangeCallbacks();
        });
      },
      init_instance_callback: function (editor) {
        console.log('opts:', self.options);
        editor.webtaOptions = self.options;
        editor.webtaController = self;

        if(self.getMceEditor()) {
          let content = self.getUserContent();
          self.setContent(content);
        }

        new OtgsWebtaEditorShortcuts(editor).bindListeners();

        editor.on('change', () => {
          self.addLastSpaceIfNeed(editor);
          self.runChangeCallbacks();
        });
        self.addLastSpaceIfNeed(editor);
        self.runChangeCallbacks();
      }
    });
  }

  addChangeCallback(name, callback) {
    this.changeCallbacks[name] = callback;
  }

  focusWithCursorOnLastCharacter() {
    const editor = this.getMceEditor();
    editor.focus();
    editor.selection.select(editor.getBody(), true);
    editor.selection.collapse(false);
  }

  getMceEditor() {
    const selector = this.outerDom.editorCssId;
    if(!this.mceEditor) {
      this.mceEditor = tinymce.editors.find((e)=> { return (e.id === selector) })
    }
    return this.mceEditor;
  }

  onPaste(event) {
    event.preventDefault();
    let text = event.clipboardData.getData('text/plain');
    if(this.viewSpaceModeOn()) {
      text = OtgsWebtaEditorVisibleSpace.convertTextToVisibleSpaces(text)
    }
    if(!_.isEmpty(text)) { this.getMceEditor().selection.setContent(text); }
  }

  onKeyPress(event) {
    if(event.keyCode === 13) event.preventDefault();
    if(event.keyCode === 32) {
      if(this.viewSpaceModeOn()) {
        event.preventDefault();
        const space = this.currentSpace();
        if(event.type === 'keyup') this.insertContent(space);
      }
    }
  }

  cleanColorArtifacts() {
    const editor = this.getMceEditor();
    const body = editor.dom.doc.body;
    const $body = $(body);

    const $artifactSpans = $body.find('span:not(.xtag)');
    if($artifactSpans.length === 0) return;

    $artifactSpans.each((i, e)=> {
      const t = editor.dom.doc.createTextNode(e.textContent);
      e.replaceWith(t);
      editor.selection.setCursorLocation(t, 1)
    });
  }

  runChangeCallbacks() {
    const updatedContent = this.getUserContent();
    Object.values(this.changeCallbacks).forEach((c)=>{
      c(updatedContent)
    })
  }

  addLastSpaceIfNeed(mceEditor) {
    const space = this.currentSpace();
    const body = mceEditor.dom.doc.body;

    if(!body.innerHTML.endsWith(space) && !body.innerHTML.endsWith(OtgsWebtaEditorVisibleSpace.renderedSymbol)) {
      $(body).append(space);
    }
  }

  setContent(content) {
    this.getMceEditor().setContent(content);
  }

  insertContent(content) {
    this.getMceEditor().selection.setContent(content)
  }

  getUserContent() {
    return this.getMceEditor().getContent({format: 'raw'});
  }

  getMarkersManager() {
    return new MarkersManager(this.getMceEditor())
  }

  disableEditor() {
    this.getMceEditor().getBody().setAttribute('contenteditable', false);
  }

  enableEditor() {
    this.getMceEditor().getBody().setAttribute('contenteditable', true);
  }

  currentSpace() {
    return this.viewSpaceModeOn() ? OtgsWebtaEditorVisibleSpace.symbol : '&nbsp;'
  }

  viewSpaceModeOn() {
    return global.viewSpaceMode[this.uniqueId];
  }

  setViewSpaceMode(value) {
    global.viewSpaceMode[this.uniqueId] = value;
  }
}
