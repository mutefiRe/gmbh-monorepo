import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  toggle: true,
  actions: {
    createUnit() {
      this.get('createUnit')(
        {
          name: this.get('name')
        }
      );
    },
    toggleButton() {
      const name = this.get('name') || '';

      if (name) {
        this.set('toggle', false);
      } else {
        this.set('toggle', true);
      }
    }
  }
});
