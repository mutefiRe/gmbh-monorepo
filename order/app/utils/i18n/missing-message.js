import config from '../../config/environment';

export default function(locale, key, context) {
  if (config.environment === 'production') {
    return key.split('.').pop();
  }

  // detailed error msg in dev environment
  Ember.Logger.error(`i18n error: locale: ${locale},  key: ${key} context: ${context}`);

  // TODO: send error msg to backend
  return `missing translation: ${key}`;
}
