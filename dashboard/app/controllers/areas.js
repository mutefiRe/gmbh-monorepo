import Ember from 'ember';

export default Ember.Controller.extend({
  newRecord: null,
  currentSelectedRecord: null,
  colors: [],
  init() {
    getColors()
      .then(colors => {
        this.set('colors', colors);
      });
  },
  actions: {
    createRecord() {
      if (!this.get('newRecord')) {
        Ember.$('body').addClass('noscroll');
        this.set('newRecord', this.get('store').createRecord('area'));
        this.set('currentSelectedRecord', {
          component: this,
          record: this.get('newRecord'),
          type:'controller'
        });
      }
    }
  }
});

function getColors() {
  return new Promise(resolve => {
    Ember.$.getJSON('/assets/colors.json', function(data) {
      resolve(data.colors);
    });
  });
}
