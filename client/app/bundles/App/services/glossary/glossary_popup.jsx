export class GlossaryPopup {
  constructor(glossaryItem, presentTerm) {
    this.glossaryItem = glossaryItem;
    this.presentTerm = presentTerm;
  };

  buildHtml() {
    const content =
      `<div class="glossary-popup-content">
         <p class="term">
           ${_.escape(this.glossaryItem.term)}
         </p>
         <p class="description">
           ${_.escape(this.glossaryItem.description)}
         </p>
         <p>
           <span>
             Suggested translation:
           </span>
           <span class="translation-value">
             ${_.escape(this.glossaryItem.translated_text)}
           </span>
         </p>
       </div>`;

    const result = `<span class="glossary-highlight" data-toggle="popover" data-content='${content}'>${this.presentTerm}</span>`;

    return result;
  };
}
