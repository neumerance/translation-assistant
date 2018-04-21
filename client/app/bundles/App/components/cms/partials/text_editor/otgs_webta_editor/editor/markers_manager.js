import * as messages from '../../../../../../constants/app_messages';
import * as stringUtils from '../../../../../../services/utils/string_utils';
import Notify from '../../../../../../constants/notify';
const notify = new Notify();

export default class MarkersManager {
  constructor(editor) {
    this.editor = editor;
  }

  applyMarker(colorData) {
    const selectedContent = this.editor.selection.getContent({format: 'text'})  || '';
    const selectedText = stringUtils.cleanString(selectedContent);

    if (!selectedText.length) {
      notify.error(
        messages.NO_TEXT_SELECTED_TITLE, messages.NO_TEXT_SELECTED_MESSAGE,
        true, `.chip_${colorData.id}_${this.editor.webtaOptions.dbid}`, 'top right'
      );
      return;
    }

    const spanElement = this.buildMarker(colorData, selectedText);
    this.applyMarkerOnSelection(spanElement);
  }

  removeMarker(colorData) {
    const content = this.editor.getContent({format: 'raw'});
    let $content = $('<div>').html(content);
    const marker = $content.find(`.${colorData.id}`);
    marker.replaceWith(marker.html());
    this.editor.setContent($content.html());
    this.editor.webtaController.runChangeCallbacks();
  }

  insertXMarker(xtag) {
    const imgElement = this.buildXMarker(xtag);
    this.applyMarkerOnSelection(imgElement);
  }

  buildMarker(markerItem, selectedText) {
    const now = Date.now();
    const dom = this.editor.dom;
    const spanElement = dom.create('span', {
      id: markerItem.id,
      class: `xtag ${markerItem.id}`,
      title: markerItem.ctype.split('x-html-').pop(),
      style: `background: ${markerItem.hex}`,
      added_at: now
    });
    spanElement.innerHTML = selectedText;
    return spanElement;
  }

  buildXMarker(markerItem) {
    const now = Date.now();
    const dom = this.editor.dom;
    const imageElement = dom.create('img', {
      id: markerItem.id,
      ctype: markerItem.type,
      class: `xtag ${markerItem.id}`,
      title: markerItem.type.split('x-html-').pop(),
      style: `background: ${markerItem.hex}`,
      src: this.generateTextImage(markerItem.type),
      added_at: now
    });
    return imageElement;
  }

  applyMarkerOnSelection(marker) {
    this.editor.selection.setNode(marker);
    this.cleanOlderMarkers();
    this.focusOnLatestMarker();
    this.editor.webtaController.runChangeCallbacks();
  }

  focusOnLatestMarker() {
    const marker = this.getLatestMarker();
    this.editor.selection.select(marker);
    this.editor.focus();
  }

  getLatestMarker() {
    const body = this.editor.dom.doc.body;
    const $markers = $(body).find('.xtag, .gtag');

    let res = $markers[0];

    $markers.each((i, e)=> {
      const maxAddedAt = (res.getAttribute('added_at') || 0);
      const curAddedAt = (e.getAttribute('added_at') || 0);
      if(curAddedAt > maxAddedAt) {
        res = e;
      }
    });

    return res;
  }

  cleanOlderMarkers() {
    const content = this.editor.getContent({format: 'raw'});
    let $content = $('<div>').html(content);

    let stats = this.getStats($content);
    let result = this.cleanContent(stats, $content);

    this.editor.setContent(result);
  }

  getStats($content) {
    const stats = {};
    const $markers = $content.find('.xtag, .gtag');

    $markers.each((i, e)=>{
      const addedAt = (e.getAttribute('added_at') || 0);
      const tempId = Math.round(Math.random() * 999999);
      $(e).attr('temp_id', tempId);

      if(!stats[e.id]) {
        stats[e.id] = { addedAt: addedAt, tempId: tempId };
      } else {
        if(addedAt > stats[e.id].addedAt) {
          stats[e.id].addedAt = addedAt;
          stats[e.id].tempId = tempId;
        }
      }
    });

    return stats;
  }

  cleanContent(stats, $content) {
    const keys = Object.keys(stats);
    for(var i = 0; i < keys.length; i++){
      const keyId = keys[i];
      const obj = stats[keyId];
      const $olderMarkers = $content.find(`#${keyId}:not([temp_id="${obj.tempId}"])`).toArray();
      const olderTempIds = $olderMarkers.map((e)=>{ return e.getAttribute('temp_id') });

      for(var j = 0; j < olderTempIds.length; j++){
        const oldMarker = $content.find(`[temp_id="${olderTempIds[j]}"]`)[0];
        if(oldMarker) {
          oldMarker.replaceWith(oldMarker.innerHTML);
          this.applyHtmlSafe($content)
        }
      }
    }
    const result = $content[0].innerHTML;
    return result;
  }


  applyHtmlSafe($content) {
    const html = $content[0].innerHTML.replace(/\&gt;/g, '>').replace(/\&lt;/g, '<');
    $content[0].innerHTML = html;
  }

   cleanHtmlName(text) {
    const arr = text.split('-');
    return arr[arr.length - 1];
  }

  generateTextImage(text) {
    const tCtx = document.getElementById('textCanvas').getContext('2d');
    tCtx.canvas.width = tCtx.measureText('< ' +  this.cleanHtmlName(text) + ' >').width + 2;
    tCtx.canvas.height = 18;
    tCtx.fillText('< ' + this.cleanHtmlName(text) + ' />', 0, 12);
    return tCtx.canvas.toDataURL();
  }

  updateMarkerData(data) {
    const body = this.editor.dom.doc.body;
    const $body = $(body);

    for(var i=0; i < data.length; i++) {
      data[i].isSet = ($body.find(`#${data[i].id}`).length > 0);
    }
  }
}
