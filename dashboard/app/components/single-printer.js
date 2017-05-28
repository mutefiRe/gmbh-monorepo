import Ember from 'ember';

export default Ember.Component.extend({
  notifications: Ember.inject.service('notification-messages'),
  i18n: Ember.inject.service(),
  tagName: 'li',
  classNameBindings: ['isOpen:open'],
  isOpen: false,
  payload: Ember.inject.service('session-payload'),
  actions: {
    toggleEditable() {
      this.toggleProperty('isOpen');
      if (this.get('isOpen')) {
        Ember.$('body').addClass('noscroll');
        this.set('currentSelectedRecord', {
          component: this,
          record: this.get('printer'),
          type: 'component'
        });
      } else {
        Ember.$('body').removeClass('noscroll');
        this.set('currentSelectedRecord', null);
      }
    },
    updatePrinter(printer) {
      printer.save().then(() => {
        this.send('toggleEditable');

        // notify user (success)
        this.get('notifications').success(this.get('i18n').t('notifications.printer.update.success'));
      }).catch(() => {
        // notify user (failure)
        this.get('notifications').error(this.get('i18n').t('notifications.printer.update.error'));
      });
    },
    testPrint() {
      const printerId = this.get('printer').id;
      $.ajax({
        headers: {
          'X-Access-Token': this.get('payload').getToken()
        },
        'method': 'POST',
        url: `${window.EmberENV.host}/api/printers/${printerId}/testprint`
      })
      .then(() => {
        this.get('notifications').success(this.get('i18n').t('notifications.printer.test.success'));
      }).catch(() => {
        this.get('notifications').error(this.get('i18n').t('notifications.printer.test.error'));
      });
    }
  }
});
