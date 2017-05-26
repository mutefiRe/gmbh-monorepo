import Ember from 'ember';

export default Ember.Component.extend({
  editable: Ember.inject.service(),
  store: Ember.inject.service(),
  tagName: 'li',
  areaToSet: '',
  isEnabled: Ember.computed('table.enabled', 'table.area.enabled', function() {
    return this.get('table.enabled') && this.get('table.area.enabled');
  }),
  notifications: Ember.inject.service('notification-messages'),
  i18n:          Ember.inject.service(),
  actions: {
    toggleEditable() {
      this.get('editable').toggle({ component: this, record: this.get('table') });
    },
    toggleButton(prop) {
      this.get('table').toggleProperty(prop);
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
