import Ember from 'ember';
import _ from 'lodash/lodash';

export default Ember.Component.extend({
  classNames: ['order-detail-view-item'],
  classNameBindings: ['css'],
  tagName: 'tr',
  click(){
    let viewOrder;
    let payOrder;

    if(this.get('pay') === "false"){
      viewOrder = _.cloneDeep(this.get('viewOrder'));
      payOrder = _.cloneDeep(this.get('payOrder'));
    }else{
      payOrder = _.cloneDeep(this.get('viewOrder'));
      viewOrder = _.cloneDeep(this.get('payOrder'));
    }
    if(viewOrder.items[this.get('orderItem.identifier')].isPaid === false){
      let orderItem = this.get('orderItem');
      if(viewOrder.items[orderItem.identifier] != undefined){
        let decrease = viewOrder.items[orderItem.identifier].prize / viewOrder.items[orderItem.identifier].amount;
        viewOrder.totalAmount -= decrease;
        viewOrder.items[orderItem.identifier].prize -= decrease;
        payOrder.totalAmount += decrease;
        if(payOrder.items[orderItem.identifier] != undefined){
          payOrder.items[orderItem.identifier].amount++;
          viewOrder.items[orderItem.identifier].amount--;
          payOrder.items[orderItem.identifier].prize += decrease;
        }
        else{
          payOrder.items[orderItem.identifier] = {}
          payOrder.items[orderItem.identifier] = _.cloneDeep(viewOrder.items[orderItem.identifier]);
          payOrder.items[orderItem.identifier].amount = 1;
          viewOrder.items[orderItem.identifier].amount--;
          payOrder.items[orderItem.identifier].prize = decrease;
        }
        payOrder.items[orderItem.identifier].isPaid = viewOrder.items[orderItem.identifier].isPaid;

        if(viewOrder.items[orderItem.identifier].amount === 0){
          delete(viewOrder.items[orderItem.identifier]);
        }
        if(this.get('pay') === "false"){
          this.set('viewOrder', viewOrder);
          this.set('payOrder', payOrder);
        }else{
          this.set('viewOrder', payOrder);
          this.set('payOrder',  viewOrder);
        }
      }
    }else{
      this.set('paid', 'herbert');
    }
  }
});
