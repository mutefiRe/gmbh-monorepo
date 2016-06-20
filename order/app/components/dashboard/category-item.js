import Ember from 'ember';

export default Ember.Component.extend({
  isShowingUpdate: true,
  tagName: 'tr',
  actions: {
    save() {
      this.toggleProperty('isShowingUpdate');
      this.get('category').save();
    },
    toggle() {
      this.toggleProperty('isShowingUpdate');
    },
    destroyCategory() {
      this.get('category').destroyRecord();
    },
    selectPrinter() {
      const selectedEl = this.$('#printer-select')[0];
      const selectedIndex = selectedEl.selectedIndex;
      const options = $('#printer-select option');
      const selectedValue = options[selectedIndex].value;

      this.get('printers').forEach((printer) => {
        if (printer.get('name') == selectedValue) {
         this.set('category.printer', printer.get('name'));
       }
     });
    }
  }
});
