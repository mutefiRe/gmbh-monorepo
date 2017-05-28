import Ember from 'ember';

export default Ember.Component.extend({
  notifications: Ember.inject.service('notification-messages'),
  store: Ember.inject.service(),
  i18n: Ember.inject.service(),
  tagName: 'li',
  classNameBindings: ['isOpen:open', 'isNew:new'],
  isOpen: false,
  isNew: false,
  init() {
    this._super();
    if (Ember.get(this, 'isNew')) {
      this.set('isOpen', true);
      Ember.$('body').addClass('noscroll');
      this.set('currentSelectedRecord', {
        component: this,
        record: this.get('table'),
        type: 'component'
      });
      this.set('table.area', this.get('areas.firstObject'));
    }
  },
  actions: {
    toggleEditable() {
      this.toggleProperty('isOpen');
      if (this.get('isOpen')) {
        Ember.$('body').addClass('noscroll');
        this.set('currentSelectedRecord', {
          component: this,
          record: this.get('table'),
          type: 'component'
        });
      } else {
        Ember.$('body').removeClass('noscroll');
        this.set('currentSelectedRecord', null);
        if (this.get('isNew')) {
          this.get('table').deleteRecord();
          this.set('table', null);this.set('product', null);
        }
      }
    },
    changeRelation(type, event) {
      const relation = this.get('store').peekRecord(type, event.target.value);
      this.get('table').set(type, relation);
      if (!this.get('isNew')) {
        this.send('toggleEditable');
        Ember.run.next(this, () => {

          Ember.$('html, body').animate({
            scrollTop: this.$().offset().top
          }, 200);
        });
      }
    },
    updateTable() {
      this.get('table').save().then(() => {
        this.send('toggleEditable');
        this.get('notifications').success(this.get('i18n').t('notifications.table.update.success'));
        Ember.$('body').removeClass('noscroll');
      }).catch(() => {
        this.get('notifications').error(this.get('i18n').t('notifications.table.update.error'));
      });
    },
    destroyTable() {
      this.get('table').destroyRecord().then(() => {
        this.send('toggleEditable');
        this.get('notifications').warning(this.get('i18n').t('notifications.table.destroy.success'));
        Ember.$('body').removeClass('noscroll');
      }).catch(() => {
        this.get('notifications').error(this.get('i18n').t('notifications.table.destroy.error'));
      });
    }
  }
});
