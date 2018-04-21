export default class Notify {
  constructor() {
    $.notifyDefaults({
      allow_dismiss: true,
      showProgressbar: false,
      placement: {
        from: "bottom",
        align: "right"
      },
      z_index: 99999,
      delay: 5000
    });
  }

  error(title = null, message = null, isAttached = false, attachmentSelector = null, attachmentPosition = 'bottom left') {
    this.initBootstrapNotify(title, message, 'danger', 'exclamation-triangle', isAttached, attachmentSelector, attachmentPosition);
  }

  success(title = null, message = null, isAttached = false, attachmentSelector = null, attachmentPosition = 'bottom left') {
    this.initBootstrapNotify(title, message, 'success', 'check-circle', isAttached, attachmentSelector, attachmentPosition);
  }

  warning(title = null, message = null, isAttached = false, attachmentSelector = null, attachmentPosition = 'bottom left') {
    this.initBootstrapNotify(title, message, 'warning', 'exclamation-circle', isAttached, attachmentSelector, attachmentPosition);
  }

  stale(title = null, message = null, isAttached = false, attachmentSelector = null, attachmentPosition = 'bottom left') {
    this.initBootstrapNotify(title, message, 'warning', 'exclamation-circle', isAttached, attachmentSelector, attachmentPosition, true);
  }

  notifyJsClose() {
    $('.notifyjs-wrapper').trigger('notify-hide');
  }

  initBootstrapNotify(title, message, type, icon, isAttached, attachmentSelector, attachmentPosition, isDefault = false) {
    const self = this;
    self.notifyJsClose();
    $.notifyClose();
    if (!title) return;
    let label = `<strong>${title}</strong>`;
    if (!message) label = `<span>${title}</span>`
    if (isAttached && attachmentSelector) {
      const notifTypes = {
        warning: 'warn',
        danger: 'error',
        success: 'success'
      }
      const options = {
        className: notifTypes[type],
        position: attachmentPosition,
        autoHide: false,
        clickToHide: false
      };
      if (isDefault) options.className = 'default'
      const uniqueClass = `close_${makeid()}`;
      const closeBtn = `<a href="javascript:void(0)"
                           class="absolute ${uniqueClass}" 
                           style="top: 0; right: 0;">
                           <span class="fa fa-close"></span>
                         </a>`
      const content = `<p class="relative">${closeBtn}${label}<br />${message}</p>`
      $(attachmentSelector).notify(content, options);
      $(`.${uniqueClass}`).on('click', function() {self.notifyJsClose()});
    } else {
      $.bootstrapNotify({
        title: label,
        message: `<p>${message}</p>`,
        icon: `fa fa-${icon}`
      }, {
        type: type
      });
    }
  }
}

export const flashNotify = (selector, type = 'success', callback = () => {}) => {
  const $elem = $(selector);
  const color = {success: '#dff0d8', stale: '#e0e0e0', error: '#f2dede'}
  $elem.stop( true, true );
  $elem.animate({backgroundColor: color[type]}, 10);
  setTimeout(() => {
    $elem.animate({backgroundColor: '#FFF'}, 3000, 'swing', () => { $elem.removeAttr('style') });
  }, 1000);
}
