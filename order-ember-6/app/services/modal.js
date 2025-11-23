import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class ModalService extends Service {
  @service i18n;
  modalType = null;
  headline = null;
  modalButtons = null;
  modalItem = null;
  state = 'hidden';

  setModal({ activeType, buttons = false, item }) {
    this.modalType = `modals/${activeType}`;
    this.modalButtons = buttons;
    this.modalItem = item;
    switch (activeType) {
      case 'table-select':
        this.headline = this.i18n.t('button.selectTable');
        break;
      case 'item-settings':
        this.headline = item?.name;
        break;
      case 'discard-order':
        this.headline = this.i18n.t('button.discardOrder');
        break;
      case 'loading-box':
        this.headline = this.i18n.t('info.processingData');
        break;
      default:
        throw new Error(`modal "${activeType}" not defined`);
    }
  }

  showModal({ activeType, buttons = false, item }) {
    this.setModal({ activeType, buttons, item });
    this.openModal();
  }

  openModal() {
    this.state = '';
  }

  closeModal() {
    this.state = 'hidden';
  }
}
