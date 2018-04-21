export class MrkTooltips {
  init($html) {
    const result = this.buildNestedGtagTitles($html);
    this.initPlugin();
    return result
  }

  build($html){
    return this.buildNestedGtagTitles($html);
  }

  preparePopovers(html, colorSelectionData) {
    const $html = $('<div/>').html(html);
    const tipPlacements = ['bottom', 'left', 'top', 'right'];

    colorSelectionData.map((x) =>{
      const parts = x.ctype.split('-');
      const title = (parts[parts.length - 1]);
      const $el = $html.find(`#${x.id}`);
      $el.attr('title', title);
      $el.attr('data-toggle', 'tooltip');
      $el.attr('data-custom-class', 'tooltip_' + x.hex.replace('#', ''));

      const tipIndex = $el.parents('.xtag, .gtag').length;

      $el.attr('data-placement', tipPlacements[tipIndex]);
    });
    return $html.html();
  }

  initPlugin(t = 500) {
    setTimeout(() => {
      $('[data-toggle="popover"]').popover({trigger: 'hover', placement: 'top', html: true});
      $('[data-toggle="tooltip"]').tooltip({trigger: 'hover'});
    }, t);
  };

  buildNestedGtagTitle($span){
    const title = $span.attr('data-toggle-title') || $span.attr('title');
    const $parentSpan = $($span.parents('.xtag')[0]);

    if($parentSpan.length > 0) {
      const titles = this.buildNestedGtagTitle($parentSpan);
      titles.push(title);
      return titles;
    }

    return [title];
  }

  buildNestedGtagTitles($html) {
    const pairs = $html.find('.xtag').toArray().map((x)=>{
      const $x = $(x);
      const originalTitle = $x.attr('title').split(",").pop();
      const title = this.buildNestedGtagTitle($x).join(', ');
      return { span: $x, title: title, originalTitle: originalTitle }
    });

    pairs.map((p)=>{
      p.span.attr('title', p.title);
      p.span.attr('data-toggle-title', p.originalTitle);
    });

    return $html;
  }
}
