import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  toggle: true,
  actions: {
    createCategory() {
      this.get('createCategory')(
        {
          name: this.get('name'),
          enabled: this.get('enabled'),
          description: this.get('description'),
          showAmount: this.get('showAmount')
        }
      );
    },
    toggleButton() {
      const name = this.get('name') || '';
      const enabled = this.get('enabled') || '';
      const description = this.get('description') || '';
      const showAmount = this.get('showAmount') || '';

      if (name && enabled && description && showAmount) {
        this.set('toggle', false);
      } else {
        this.set('toggle', true);
      }
    }
  }
});
