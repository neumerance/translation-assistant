(function ($) {

    if (typeof $.fn.tooltip.Constructor === 'undefined') {
        throw new Error('Bootstrap Tooltip must be included first!');
    }

    var Tooltip = $.fn.tooltip.Constructor;

    $.extend( Tooltip.DEFAULTS, {
        customClass: ''
    });

    var _show = Tooltip.prototype.show;

    Tooltip.prototype.show = function () {
        _show.apply(this,Array.prototype.slice.apply(arguments));

        if ( this.options.customClass ) {
            var $tip = this.tip()
            $tip.addClass(this.options.customClass);
        }

    };

    Tooltip.prototype.getTitle = function () {
      var title
      var $e = this.$element
      var o  = this.options

      title = $e.attr('data-toggle-title')
        || $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title);

      return title
    }

})(window.jQuery);