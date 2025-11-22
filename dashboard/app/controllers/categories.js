import Ember from 'ember';

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  currentSelectedRecord: null,
  newRecord: null,
  colors: [],
  icons: getIcons(),
  init() {
    getColors()
      .then(colors => {
        this.set('colors', colors);
      });
  },
  printers: Ember.computed('store.printer', function() {
    return this.get('store').findAll('printer');
  }),
  actions: {
    createRecord() {
      if (!this.get('newRecord')) {
        Ember.$('body').addClass('noscroll');
        this.set('newRecord', this.get('store').createRecord('category'));
        this.set('currentSelectedRecord', {
          component: this,
          record: this.get('newRecord'),
          type: 'controller'
        });
      }
    }
  }
});

function getIcons() {
  const iconNames = new Set();
  const rules = [...document.styleSheets[0].cssRules];
  rules.forEach(rule => {
    const selector = rule.selectorText;
    if ((selector || "").includes("icon-")) {
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
