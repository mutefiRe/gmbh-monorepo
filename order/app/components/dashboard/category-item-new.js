import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  toggle: true,
  selectedPrinter: null,
  actions: {
    createCategory() {
      this.get('createCategory')(
      {
        name: this.get('name'),
        enabled: this.get('enabled'),
        description: this.get('description'),
        showAmount: this.get('showAmount'),
        printer: this.get('selectedPrinter')
      }
      );
    },
    toggleButton() {
      const name = this.get('name') || '';
      const enabled = this.get('enabled') || '';
      const description = this.get('description') || '';
      const showAmount = this.get('showAmount') || '';

      if (name && description) {
        this.set('toggle', false);
      } else {
        this.set('toggle', true);
      }
    },
    selectPrinter() {
      const selectedEl = this.$('#printer-select')[0];
      const selectedIndex = selectedEl.selectedIndex;
      const options = $('#printer-select option');
      const selectedValue = options[selectedIndex].value;
      this.get('printers').forEach((printer) => {
        if (printer.get('name') == selectedValue) {
          this.set('selectedPrinter', printer.get('name'));
        }
      });
    }
  }
});
