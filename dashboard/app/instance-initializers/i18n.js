export default {
  name: 'i18n',
  initialize(appInstance) {
    const i18n = appInstance.lookup('service:i18n');

    i18n.set('locale', calculateLocale(i18n.get('locales')));
  }
};

function calculateLocale(locales) {
  const language = navigator.language || navigator.userLanguage;

  return locales.includes(language.toLowerCase()) ? language : 'de';
}
