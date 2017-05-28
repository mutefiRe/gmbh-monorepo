import Ember from 'ember';

export default Ember.Component.extend({
  notifications: Ember.inject.service('notification-messages'),
  store: Ember.inject.service(),
  i18n: Ember.inject.service(),
  tagName: 'li',
  areaToSet: '',
  classNameBindings: ['isOpen:open'],
  isOpen: false,
  init() {
    this._super();
    const area = this.get('store').peekRecord('area', this.get('table.area.id'));
    this.set('areaToSet', area);
  },
  actions: {
    toggleEditable() {
      this.toggleProperty('isOpen');
      if (this.get('isOpen')) {
        Ember.$('body').addClass('noscroll');
        this.set('currentSelectedTable', {
          component: this,
          record: this.get('table'),
          type: 'component'
        });
      } else {
        Ember.$('body').removeClass('noscroll');
        this.set('currentSelectedTable', null);
      }
    },
    changeRelation(table, event) {
      const area = this.get('store').peekRecord('area', event.target.value);
      this.set('areaToSet', area);
    },
    updateTable(table) {
      table.set('area', this.get('areaToSet'));
      table.save().then(() => {
        this.send('toggleEditable');
        this.get('notifications').success(this.get('i18n').t('notifications.table.update.success'));
      }).catch(() => {
        this.get('notifications').error(this.get('i18n').t('notifications.table.update.error'));
      });
    },
    destroyTable(table) {
      table.destroyRecord().then(() => {
        this.get('notifications').warning(this.get('i18n').t('notifications.table.destroy.success'));
      }).catch(() => {
        this.get('notifications').error(this.get('i18n').t('notifications.table.destroy.error'));
      });
    }
  }
});
