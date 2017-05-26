import Ember from 'ember';

export default Ember.Component.extend({
  notifications: Ember.inject.service('notification-messages'),
  i18n: Ember.inject.service(),
  tagName: 'li',
  classNameBindings: ['isOpen:open'],
  isOpen: false,
  actions: {
    updateUser(user) {
      user.save().then(() => {
        this.send('toggleEditable');
        this.get('notifications').success(this.get('i18n').t('notifications.user.update.success'));
      }).catch(() => {
        this.get('notifications').error(this.get('i18n').t('notifications.user.update.error'));
      });
    },
    toggleEditable() {
      this.toggleProperty('isOpen');
      if (this.get('isOpen')) {
        $('body').addClass('noscroll');
        this.set('currentSelectedUser', { toggleable: this.get('isOpen'), record: this.get('user') });
      } else {
        $('body').removeClass('noscroll');
        this.set('currentSelectedUser', null);
      }
    }
  }
});
