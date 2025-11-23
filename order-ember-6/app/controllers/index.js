import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { storageFor } from 'ember-local-storage';

export default class IndexController extends Controller {
  @service session;
  @service payload;
  @service modal;
  @service connection;
  @service notificationMessages;
  @service store;

  orderStorage = storageFor('order');
  payStorage = storageFor('pay');
  tableStorage = storageFor('table');

  actualCategory = false;
  order = null;
  orderItems = [];
  user = null;
  actualOrder = null;


  // Computed properties
  get enabledCategories() {
    // Support both classic and Octane model property names
    const categories = this.model?.categories || this.model?.Categories || [];
    return categories.filter(category => category.enabled);
  }

  get enabledAreas() {
    // Support both classic and Octane model property names
    const areas = this.model?.areas || this.model?.Areas || [];
    return areas.filter(area => area.enabled);
  }

  constructor() {
    super(...arguments);
    const id = this.payload.getId();
    if (id) {
      this.store.findRecord('user', id).then(user => {
        this.user = user;
        const order = this.store.createRecord('order', {});
        order.user = user;
        this.order = order;
      });
    } else {
      // Graceful handling: show notification and skip user setup
      this.notificationMessages?.error('No user id found. Please log in.', { autoClear: true });
      // Optionally, redirect to login or set a fallback state here
    }
  }

  setActualOrder(table) {
    this.actualOrder = table;
  }

  changeCategory(category) {
    this.actualCategory = (this.actualCategory === category) ? false : category;
  }

  addItemToOrder(item, extras = null, count = 1) {
    const order = this.order;
    const orderitems = order.orderitems.filter(oi => oi.item.id === item.id && oi.extras === extras);
    if (orderitems.length === 0) {
      const newOrderitem = this.store.createRecord('orderitem', { order, item, extras, price: item.price, count });
      if (newOrderitem.price === 0) newOrderitem.countPaid = 1;
    } else {
      orderitems[0].count++;
      if (orderitems[0].price === 0) orderitems[0].countPaid++;
    }
  }

  saveOrder(goToOrderMain) {
    this.goToOrderMain = goToOrderMain;
    const order = this.order;
    this.modal.showModal({ activeType: 'loading-box' });
    this.connection.status ? this.saveOrderAPI(order) : this.saveOrderOffline(order);
  }

  resetOrder() {
    const order = this.store.createRecord('order', {});
    order.user = this.user;
    this.order = order;
  }

  discardOrder() {
    let order = this.order;
    order.orderitems.forEach(oi => oi.unloadRecord());
    order.unloadRecord();
    order = this.store.createRecord('order', {});
    order.user = this.user;
    this.order = order;
    this.notifications.info(this.i18n.t('notification.order.discard'), { autoClear: true });
  }

  removeItemFromOrder(orderitem) {
    const order = orderitem.order;
    order.totalAmount -= orderitem.price * orderitem.count;
    this.store.deleteRecord(orderitem);
  }

  printBill(orderId) {
    if (this.connection) {
      this.modal.showModal({ activeType: 'loading-box' });
      this.store.createRecord('print', { order: orderId, isBill: true }).save().then(() => {
        this.notifications.success(this.i18n.t('notification.bill.success'), { autoClear: true });
        this.modal.closeModal();
      }).catch(() => {
        this.notifications.error(this.i18n.t('notification.bill.error'), { autoClear: true });
        this.modal.closeModal();
      });
    } else {
      this.notifications.error(this.i18n.t('notification.bill.notConnected'), { autoClear: true });
    }
  }

  socketDisconnected() {
    this.connection.setStatus(false);
  }

  socketReconnected() {
    this.connection.setStatus(true);
    if (this.order.user && this.order.table) this.syncOfflineStorages();
  }

  get syncNeeded() {
    return this.orderStorage.getArray().length || this.tableStorage.getArray().length || this.payStorage.getArray().length ? true : false;
  }

  syncOfflineStorages() {
    if (!this.isSyncing && this.syncNeeded) {
      this.isSyncing = true;
      Promise.all(this.tableStorage.recordsPromises()).then(() => {
        return Promise.all(this.orderStorage.recordsPromises());
      }).then(() => {
        return Promise.all(this.payStorage.recordsPromises());
      }).then(() => {
        this.isSyncing = false;
        this.notifications.success(this.i18n.t('notification.sync.success'), { autoClear: true });
      }).catch(() => {
        this.isSyncing = false;
        this.notifications.error(this.i18n.t('notification.sync.error'), { autoClear: true });
      });
    }
  }

  saveOrderOffline(order) {
    const serializedOrder = order.serialize();
    serializedOrder.id = order.id;
    this.orderStorage.addObject(serializedOrder);
    this.notifications.info(this.i18n.t('notification.order.offline'), { autoClear: true });
    this.resetOrder();
    if (this.model?.settings?.[0]?.instantPay || this.user?.isCashier) {
      this.actualOrder = order;
    }
    this.modal.closeModal();
    this.goToOrderMain();
  }

  async saveOrderAPI(order) {
    this.syncOfflineStorages();
    try {
      await order.save();
      await this.handleAPISaveAndPrint(order);
      this.finishSaveProcess(order);
      this.notifications.success(this.i18n.t('notification.order.success'), { autoClear: true });
    } catch {
      this.modal.closeModal();
      this.notifications.error(this.i18n.t('notification.order.error'), { autoClear: true });
    }
  }

  async handleAPISaveAndPrint(order) {
    order.orderitems.filter(oi => oi.id == null).forEach(oi => oi.unloadRecord());
    this.resetOrder();
    await this.store.createRecord('print', { order: order.id, isBill: false }).save();
  }

  finishSaveProcess(order) {
    if (this.model?.settings?.[0]?.instantPay || this.user?.isCashier) {
      this.actualOrder = order;
    }
    this.modal.closeModal();
    this.goToOrderMain();
  }
}
