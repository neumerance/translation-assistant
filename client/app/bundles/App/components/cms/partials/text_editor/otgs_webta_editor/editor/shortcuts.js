import MarkersManager from './markers_manager'
import ShortcutKeys from './shortcut_keys'
import FeaturesNavigation from '../features/navigation'
const nullFunc = ()=>{};

export default class OtgsWebtaEditorShortcuts {
  constructor(editor){
    this.editor = editor;
    this.shortcutKeys = new ShortcutKeys();
    this.markersManager = new MarkersManager(editor);
  }

  bindListeners() {
    this.bindMarkers();
    this.bindXMarkers();
    this.bindActions();
    this.bindBodyGlobalKeys();
  }

  bindActions() {
    const keys = this.shortcutKeys;
    const nav = new FeaturesNavigation();

    // editor features
    this.registerCommand(keys.saveSentencePattern(), nav.saveSentence);
    this.registerCommand(keys.declareIncompletePattern(), nav.incompleteSentence);
    this.registerCommand(keys.createSentenceIssuePattern(), nav.createSentenceIssue);
    this.registerCommand(keys.resetToOriginalPattern(), nav.resetToOriginal);
    this.registerCommand(keys.toggleSentenceGlossaryPattern(), nav.toggleSentenceGlossary);
    this.registerGlobalCommand(keys.machineTranslation(), nav.machineTranslation);

    // global features
    this.registerGlobalCommand(keys.nextSentencePattern(), ()=>{ nav.nextSentence() });
    this.registerGlobalCommand(keys.prevSentencePattern(), ()=>{ nav.prevSentence() });
    this.registerGlobalCommand(keys.declareJobAsCompletePattern(), nav.completeJob);
    this.registerGlobalCommand(keys.switchPreviewPattern(), nav.previewJob);
    this.registerGlobalCommand(keys.switchTranslatePattern(), nav.backToEditor);
    this.registerGlobalCommand(keys.toggleGlobalGlossaryPattern(), nav.toggleGlobalGlossary);
    this.registerGlobalCommand(keys.visualizeSpacesPattern(), nav.visualizeSpaces);
  }

  bindBodyGlobalKeys() {
    if($('body.listen-keys').length > 0) return;

    for(let i=0; i <= 9; i++) {
      this.globalCommands[`alt+${i}`] = nullFunc;
      this.globalCommands[`ctrl+alt+${i}`] = nullFunc;
      this.globalCommands[`alt+shift+${i}`] = nullFunc;
    }
    console.log('bind global', this.globalCommands);

    $('body:not(.listen-keys)').keydown((event)=> {
      const ctrl = (event.ctrlKey || event.metaKey) ? 'ctrl+' : '';
      const alt = event.altKey ? 'alt+' : '';
      const shift = event.shiftKey ? 'shift+' : '';
      const key = event.key.toLowerCase().replace('arrow', '');

      const pattern = `${ctrl}${alt}${shift}${key}`;
      const command = this.globalCommands[pattern];

      if(command) {
        event.preventDefault();
        event.stopPropagation();
        console.log(pattern, this.globalCommands);
        command();
      }
      else { console.log(pattern, this.globalCommands); }
    });
    this.bindGlobalButtons();
    $('body').addClass('listen-keys');
  }

  bindGlobalButtons() {
    const nav = new FeaturesNavigation();

    $('.nextSentence').click(()=>{ nav.nextSentence() });
    $('.prevSentence').click(()=>{ nav.prevSentence() });
  }

  bindMarkers() {
    const self = this;
    const options = self.editor.webtaOptions;

    for(let index = 0; index < 10; index++) {
      const c = options.shortcutsOptions.colorSelectionData[index];
      const pattern = self.shortcutKeys.insertMarkerKey(index);
      if(!pattern) return;

      self.registerCommand(pattern.pattern, ()=> {
        if(c) { self.markersManager.applyMarker(c) }
      });
    }
  }

  bindXMarkers() {
    const self = this;
    const options = self.editor.webtaOptions;

    for(let index = 0; index < 10; index++) {
      const c = options.shortcutsOptions.xtagTokenData[index];
      const pattern = self.shortcutKeys.insertXMarkerKey(index);
      if(!pattern) return;

      self.registerCommand(pattern.pattern, ()=> {
        if(c) { self.markersManager.insertXMarker(c) }
      });
    }
  }

  registerGlobalCommand(pattern, command) {
    this.registerCommand(pattern, command);

    if(!this.globalCommands) { this.globalCommands = {}; }
    this.globalCommands[pattern] = command;
  }

  registerCommand(pattern, command) {
    const crossCompatiblePattern = this.convertPattern(pattern);
    const c = ()=> {
      console.log(pattern, crossCompatiblePattern);
      command();
    };
    this.editor.shortcuts.add(crossCompatiblePattern, c, c, c);
  }

  convertPattern(pattern) {
    let result = pattern.replace('ctrl', 'meta');
    result = result.replace('up', '38');
    result = result.replace('left', '37');
    result = result.replace('right', '39');
    result = result.replace('down', '40');
    result = result.replace('enter', '13');
    result = result.replace('insert', '45');

    return result
  }
}
