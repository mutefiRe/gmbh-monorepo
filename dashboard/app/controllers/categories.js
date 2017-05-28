import Ember from 'ember';

function getIcons() {
  const iconNames = new Set();
  const rules = [...document.styleSheets[0].cssRules];
  rules.forEach(rule => {
    const selector = rule.selectorText;
    if ((selector || "").includes("iconfont-")) {
      iconNames.add(selector.substr(1, selector.indexOf(":") - 1));
    }
  });
  return [...iconNames];
}

function getColors() {
  return new Promise(resolve => {
    Ember.$.getJSON('/assets/colors.json', function(data) {
      resolve(data.colors);
    });
  });
}

export default Ember.Controller.extend({
  init() {
    getColors()
      .then(colors => {
        this.set('colors', colors);
      });
  },
  currentSelectedCategory: null,
  icons: getIcons(),
  colors: [],
  store: Ember.inject.service(),
  printers: Ember.computed('store.printer', function() {
    return this.get('store').findAll('printer');
  })
});
