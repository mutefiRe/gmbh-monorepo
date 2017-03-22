import Ember from 'ember';

export default Ember.Service.extend({
  modalType:    'modals/table-select',
  headline:     'Tisch auswählen',
  modalButtons: true,
  state:        "hidden",
  setModal({ activeType, buttons = false, item }){
    this.set('modalType', `modals/${activeType}`);
    this.set('modalButtons', buttons);
    this.set('modalItem', item);
    switch (activeType) {
      case 'table-select':
        this.set('headline', 'Tisch auswählen');
        break;
      case 'item-settings':
        this.set('headline', this.get('modalItem').get('name'));
        break;
      case 'discard-order':
        this.set('headline', 'Bestellung verwerfen?');
        break;
      case 'loading-box':
        this.set('headline', 'verarbeite Daten');
        break;
      default:
        throw `modal "${activeType}" not defined`;
    }
  },
  showModal({ activeType, buttons = false, item }) {
    this.setModal({ activeType, buttons, item });
    this.openModal();
  },
  openModal(){
    this.set('state', '');
  },
  closeModal(){
    this.set('state', 'hidden');
  }
});
