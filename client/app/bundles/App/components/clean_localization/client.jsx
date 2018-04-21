export const CleanLocalizationClient = {
  translate: (key, opts = {})=> {
    let value = (PureLocalizationDB.data[key] || '');
    Object.keys(opts).forEach(function(k) {
      value = value.replace(`%{${k}}`, opts[k]);
    });
    return value;
  },
};

CleanLocalizationClient.t = CleanLocalizationClient.translate;
