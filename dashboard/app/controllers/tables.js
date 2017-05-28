import Ember from 'ember';

export default Ember.Controller.extend({
  newRecord: null,
  currentSelectedRecord: null,
  i18n: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),
  actions: {
    createRecord() {
      if (!this.get('newRecord')) {
        Ember.$('body').addClass('noscroll');
        this.set('newRecord', this.get('store').createRecord('table'));
        this.set('currentSelectedRecord', {
          component: this,
          record: this.get('newRecord'),
          type:'controller'
        });
      }
    }
  }
});
