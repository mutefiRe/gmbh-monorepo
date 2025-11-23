import Service from '@ember/service';

// Minimal i18n service stub for compatibility
export default class I18nService extends Service {
  t(key, options = {}) {
    // Return the key itself for now, optionally interpolate options
    if (options && Object.keys(options).length > 0) {
      // Simple interpolation: replace {var} in key with options[var]
      return key.replace(/\{(\w+)\}/g, (_, k) => options[k] ?? `{${k}}`);
    }
    return key;
  }
}
