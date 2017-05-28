import Ember from 'ember';

export default Ember.Controller.extend({
  currentSelectedRecord: null,
  actions: {
    createRecord() {
      if (!this.get('newRecord')) {
        Ember.$('body').addClass('noscroll');
        this.set('newRecord', this.get('store').createRecord('printer'));
        this.set('currentSelectedRecord', {
          component: this,
          record: this.get('newRecord'),
          type:'controller'
        });
      }
    }
  }
});
