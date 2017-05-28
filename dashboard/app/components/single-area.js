import Ember from 'ember';

export default Ember.Component.extend({
  notifications: Ember.inject.service('notification-messages'),
  i18n: Ember.inject.service(),
  tagName: 'li',
  classNameBindings: ['isOpen:open'],
  isOpen: false,
  isNew: false,
  init(){
    this._super(...arguments);
    if (Ember.get(this, 'isNew')) {
      this.set('isOpen', true);
      Ember.$('body').addClass('noscroll');
      this.set('currentSelectedRecord', {
        component: this,
        record: this.get('area'),
        type: 'component'
      });
    }
  },
  actions: {
    toggleEditable() {
      this.toggleProperty('isOpen');
      if (this.get('isOpen')) {
        Ember.$('body').addClass('noscroll');
        this.set('currentSelectedRecord', {
          component: this,
          record: this.get('area'),
          type: 'component'
        });
      } else {
        Ember.$('body').removeClass('noscroll');
        this.set('currentSelectedRecord', null);
        if (this.get('isNew')) {
          this.get('area').deleteRecord();
          this.set('area', null);
        }
      }
    },
    toggleButton(prop) {
      this.get('area').toggleProperty(prop);
    },
    updateArea() {
      this.get('area').save().then(() => {
        this.send('toggleEditable');
        this.get('notifications').success(this.get('i18n').t('notifications.area.update.success'));
        Ember.$('body').removeClass('noscroll');
      }).catch(() => {
        this.get('notifications').error(this.get('i18n').t('notifications.area.update.error'));
      });
    },
    destroyArea() {
      this.get('area').destroyRecord().then(() => {
        this.get('notifications').warning(this.get('i18n').t('notifications.area.destroy.success'));
        Ember.$('body').removeClass('noscroll');
      }).catch(() => {
        this.get('notifications').error(this.get('i18n').t('notifications.area.destroy.error'));
      });
    }
  }
});
