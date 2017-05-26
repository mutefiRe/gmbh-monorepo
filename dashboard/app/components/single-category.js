import Ember from 'ember';

export default Ember.Component.extend(Ember.Evented, {
  isShowingIcons: false,
  isShowingColors: false,
  editable: Ember.inject.service(),
  enable: Ember.inject.service(),
  tagName: 'li',
  actions: {
    toggleEditable() {
      this.get('editable').toggle({ component: this, record: this.get('category') });
    },
    toggleButton(prop) {
      this.get('category').toggleProperty(prop);
    },
    updateCategory(category) {
      category.save().then(() => {
        this.send('toggleEditable');
      }).catch(() => {
        console.log('Error');
      });
    },
    destroyCategory(category) {
      category.destroyRecord();
    }
  }
});
