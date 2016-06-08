import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  disabled: function () {
    if (typeof this.get('name') === 'undefined' || this.get('name') === '') {
      return true;
    }

    return false;
  }.property('name'),
  actions: {
    saveArea() {
      this.get('saveArea')({
        name: this.get('name')
      });
      this.set('name', '');
    }
  }
});
