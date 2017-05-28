import Ember from 'ember';

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),
  tagName: 'li',
  isShowingPassword: false,
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
        record: this.get('user'),
        type: 'component'
      });
      this.set('user.role', "waiter");
    }
  },
  actions: {
    updateUser() {
      this.get('user').save().then(() => {
        this.send('toggleEditable');
        this.get('notifications').success(this.get('i18n').t('notifications.user.update.success'));
        Ember.$('body').removeClass('noscroll');
      }).catch(() => {
        this.get('notifications').error(this.get('i18n').t('notifications.user.update.error'));
      });
    },
    destroyUser() {
      this.get('user').destroyRecord().then(() => {
        this.send('toggleEditable');
        this.get('notifications').warning(this.get('i18n').t('notifications.user.destroy.success'));
        Ember.$('body').removeClass('noscroll');
      }).catch(() => {
        this.get('notifications').error(this.get('i18n').t('notifications.user.destroy.error'));
      });
    },
    toggleEditable() {
      this.toggleProperty('isOpen');
      if (this.get('isOpen')) {
        Ember.$('body').addClass('noscroll');
        this.set('currentSelectedRecord', {
          component: this,
          record: this.get('user'),
          type: 'component'
        });
      } else {
        Ember.$('body').removeClass('noscroll');
        this.set('currentSelectedRecord', null);
        if (this.get('isNew')) {
          if (this.get('user.hasDirtyAttributes')) this.get('user').deleteRecord();
          this.set('user', null);
        }
      }
    }
  }
});
