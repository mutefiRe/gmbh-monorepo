import Ember from 'ember';

export default Ember.Component.extend({
  notifications: Ember.inject.service('notification-messages'),
  store: Ember.inject.service(),
  i18n: Ember.inject.service(),
  tagName: 'li',
  areaToSet: '',
  classNameBindings: ['isOpen:open'],
  isOpen: false,
  actions: {
    toggleEditable() {
      this.toggleProperty('isOpen');
    },
    changeRelation(table, event) {
      const area = this.get('store').peekRecord('area', event.target.value);
      this.set('areaToSet', area);
    },
    updateTable(table) {
      table.set('area', this.get('areaToSet'));
      table.save().then(() => {
        this.send('toggleEditable');

        // notify user (success)
        this.get('notifications').success(this.get('i18n').t('notifications.table.update.success'));
      }).catch(() => {
        // notify user (failure)
        this.get('notifications').error(this.get('i18n').t('notifications.table.update.error'));
      });
    },
    destroyTable(table) {
      table.destroyRecord().then(() => {
        // notify user (warning)
        this.get('notifications').warning(this.get('i18n').t('notifications.table.destroy.success'));
      }).catch(() => {
        // notify user (failure)
        this.get('notifications').error(this.get('i18n').t('notifications.table.destroy.error'));
      });
    }
  }
});
