import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  x: DS.attr('number'),
  y: DS.attr('number'),
  custom: DS.attr('boolean', { defaultValue: false }),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  area: DS.belongsTo('area'),
  orders: DS.hasMany('order'),
  orderitems: Ember.computed('orders', function () {
    const final = new Array();
    const orders = this.get('orders');
    orders.toArray().map(order => {
      order.get('orderitems').toArray().map( orderitem  => {
        final.push(orderitem);
      });
    });
    return final;
  }),
  openAmount: Ember.computed('orderitems.@each.countPaid', function () {
    const orderitems = this.get('orderitems');
    let sum = 0;
    for (const orderitem of orderitems) {
      sum += orderitem.get('price') * (orderitem.get('count') - orderitem.get('countPaid'));
    }
    return sum;
  })
});
