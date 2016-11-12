import Ember from 'ember';

export default Ember.Controller.extend({
  classNames: ['order'],
  session: Ember.inject.service('session'),
  payload: Ember.inject.service('session-payload'),
  actualCategory: false,
  swipeHelper: {
    'order-overview': {active: false, last: false},
    'order-screen': {active: true, last: false},
    'order-list': {active: false, last: true},
    'order-detail': {active: false, last: false}
  },
  modalType: 'table-select',
  modalHeadline: 'Tisch auswählen',
  modalButtons: true,
  order: null,
  modalItem: null,
  orderItems: [],
  barKeeper: false,
  user: null,
  actualOrder: null,

  viewOrder: {
    items: {},
    totalAmount: 0
  },
  triggerModal: false,
  triggerOrderListSwipe: true,
  init() {
    const id = this.get('payload.id');

    this.store.find('user', id).then( user => {
      this.set('user', user);
      const order = this.store.createRecord('order', {});
      order.set('user', user);
      this.set('order', order);

      if (this.get('user.printer')) {
        this.set('barKeeper', true);
        this.store.findAll('table').then( table => {
          order.set('table', table.get('firstObject'));
        });
      }
    });
  },
  actions: {
    changeCategory(category) {
      if (this.get('actualCategory') === category) {
        this.set('actualCategory', false);
      } else {
        this.set('actualCategory', category);
      }
    },
    addItemToOrder(item, extras = null) {
      const order = this.get('order');
      const totalAmount = order.get('totalAmount');

      const orderItem = order.get('orderitems')
      .filterBy('item.id', item.id)
      .filterBy('extras', extras);

      if (orderItem.length === 0) {
        this.store.createRecord('orderitem', {order: this.get('order'), item, extras, price: item.get('price')});
      } else {
        orderItem[0].incrementProperty('count');
      }
      order.set('totalAmount', totalAmount + item.get('price'));
    },

    showModal(activeType, buttons, item) {
      this.set('modalType', activeType);
      this.set('modalButtons', buttons);
      this.set('modalItem', item);
      switch (activeType) {
        case 'table-select':
          this.set('modalHeadline', 'Tisch auswählen');
          break;
        case 'item-settings':
          this.set('modalHeadline', this.get('modalItem').get('name'));
          break;
        case 'discard-order':
          this.set('modalHeadline', 'Bestellung verwerfen?');
          break;
        default:
          break;
      }
      this.toggleProperty('triggerModal');
    },
    showLoadingModal() {
      this.set('modalType', 'show-loading-modal');
      this.set('modalButtons', false);
      this.set('modalItem', null);
      this.set('modalHeadline', 'verarbeite Daten');
      this.toggleProperty('triggerModal');
    },
    swipeOrderList() {
      this.toggleProperty('triggerOrderListSwipe');
    },
    saveOrder(goToOrderScreen) {
      const order = this.get('order');
      this.send('showLoadingModal');
      order.save()
      .then(() => {
        order.get('orderitems').filterBy('id', null).invoke('unloadRecord');
        this.send('resetOrder');
        return this.store.createRecord('print',{order: order.id, isBill: false}).save();
      }).then(() => {
        if(this.get('model.Settings.firstObject.instantPay')){
          this.set('actualOrder', order);
        }
        this.toggleProperty('triggerModal');
        goToOrderScreen();
      }).catch(() => {
        // nothing to do here
      });
    },
    resetOrder(){

      let order = this.get('order');

      order.get('orderitems').invoke('unloadRecord');
      order.unloadRecord();

      order = this.store.createRecord('order', {});
      order.set('user', this.get('user'));
      this.set('order', order);


    },
    removeItemFromOrder(orderitem) {
      const order = orderitem.get('order');
      const totalAmount = order.get('totalAmount');

      order.set('totalAmount', totalAmount -  orderitem.get('price') * orderitem.get('count'));
      this.store.deleteRecord(orderitem);
    },
    printBill(orderId){
      this.store.createRecord('print', {order: orderId, isBill: true}).save().then(() => {
        this.toggleProperty('triggerModal');
      });
    },
    triggerModal(){
      this.toggleProperty('triggerModal');
    },
    socketDisconnected() {
      this.set('modalHeadline', 'Verbindungsfehler');
      this.set('modalType', 'error-screen');
      this.set('modalButtons', false);
      if($('.modal').hasClass('hidden')){
        this.toggleProperty('triggerModal');
      }
    },
    socketReconnected() {
      if(!$('.modal').hasClass('hidden')){
        this.toggleProperty('triggerModal');
      }
    }
  }
});
