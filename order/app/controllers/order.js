import Ember from 'ember';

export default Ember.Controller.extend({
  classNames:     ['order'],
  session:        Ember.inject.service('session'),
  payload:        Ember.inject.service('session-payload'),
  modal:          Ember.inject.service('modal'),
  actualCategory: false,
  order:          null,
  orderItems:     [],
  barKeeper:      false,
  user:           null,
  actualOrder:    null,
  connection:     true,
  init() {
    const id = this.get('payload').getId();
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

      const orderitem = order.get('orderitems')
      .filterBy('item.id', item.id)
      .filterBy('extras', extras);

      if (orderitem.length === 0) {
        const newOrderitem = this.store.createRecord('orderitem', {order: this.get('order'), item, extras, price: item.get('price')});
        if (newOrderitem.get('price') === 0) newOrderitem.set('countPaid', 1);

      } else {
        orderitem[0].incrementProperty('count');
        if(orderitem[0].get('price') === 0) orderitem[0].incrementProperty('countPaid');
      }
    },
    saveOrder(goToOrderMain) {
      const order = this.get('order');
      this.get('modal')
        .showModal({ activeType: 'loading-box' });
      order.save()
      .then(() => {
        order.get('orderitems').filterBy('id', null).invoke('unloadRecord');
        this.send('resetOrder');
        return this.store.createRecord('print',{order: order.id, isBill: false}).save();
      }).then(() => {
        if(this.get('model.Settings.firstObject.instantPay')){
          this.set('actualOrder', order);
        }
        this.get('modal').closeModal();
        goToOrderMain();
      }).catch(err => {
        console.log(err);
        // nothing to do here
        // push to offline storage queue / hoodie
      });
    },
    resetOrder(){
      const order = this.store.createRecord('order', {});
      order.set('user', this.get('user'));
      this.set('order', order);
    },
    discardOrder(){
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
      this.get('modal').showModal({ activeType: 'loading-box' });
      this.store.createRecord('print', {order: orderId, isBill: true}).save().then(() => {
        this.get('modal').closeModal();
      });
    },
    socketDisconnected() {
      this.set('connection', false);
    },
    socketReconnected() {
      this.set('connection', true);
    },
    showLoadingModal(){
      this.get('modal').showModal({ activeType: 'loading-box' });
    }
  }
});
