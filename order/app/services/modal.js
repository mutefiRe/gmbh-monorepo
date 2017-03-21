import Ember from 'ember';

export default Ember.Service.extend({
  i18n:         Ember.inject.service(),
  modalType:    null,
  headline:     null,
  modalButtons: null,
  state:        "hidden",
  setModal({ activeType, buttons = false, item }){
    this.set('modalType', `modals/${activeType}`);
    this.set('modalButtons', buttons);
    this.set('modalItem', item);
    switch (activeType) {
      case 'table-select':
        this.set('headline', this.get('i18n').t('button.selectTable'));
        break;
      case 'item-settings':
        this.set('headline', this.get('modalItem').get('name'));
        break;
      case 'discard-order':
        this.set('headline', this.get('i18n').t('button.discardOrder'));
        break;
      case 'loading-box':
        this.set('headline', this.get('i18n').t('info.processingData'));
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
