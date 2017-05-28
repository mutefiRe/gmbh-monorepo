import Ember from 'ember';

export default Ember.Component.extend(Ember.Evented, {
  notifications: Ember.inject.service('notification-messages'),
  i18n: Ember.inject.service(),
  store: Ember.inject.service(),
  isShowingIcons: false,
  isShowingColors: false,
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
        record: this.get('category'),
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
          record: this.get('category'),
          type: 'component'
        });
      } else {
        Ember.$('body').removeClass('noscroll');
        this.set('currentSelectedRecord', null);
        if (this.get('isNew')) {
          this.get('category').deleteRecord();
          this.set('category', null);
        }
      }
    },
    changeRelation(type, event) {
      const relation = this.get('store').peekRecord(type, event.target.value);
      this.get('category').set(type, relation);
    },
    toggleButton(prop) {
      this.get('category').toggleProperty(prop);
    },
    updateCategory() {
      this.get('category').save().then(() => {
        this.send('toggleEditable');
        this.get('notifications').success(this.get('i18n').t('notifications.category.update.success'));
        Ember.$('body').removeClass('noscroll');
      }).catch(() => {
        this.get('notifications').error(this.get('i18n').t('notifications.category.update.error'));
      });
    },
    destroyCategory() {
      this.get('category').destroyRecord().then(() => {
        this.get('notifications').warning(this.get('i18n').t('notifications.category.destroy.success'));
        Ember.$('body').removeClass('noscroll');
      }).catch(() => {
        this.get('notifications').error(this.get('i18n').t('notifications.category.destroy.error'));
      });
    }
  }
});
