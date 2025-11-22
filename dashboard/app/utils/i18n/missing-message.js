import config from '../../config/environment';

export default function(locale, key) {
  // if there is no translation for a key => fallback to original (only in production environment)
  if (config.environment === 'production') {
    return false;
  }

  // if there is no translation for a key => error msg (only in test / development environment)
  return `missing translation: ${key}`;
}
