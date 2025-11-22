import DS from 'ember-data';

export default DS.Model.extend({
  name:       DS.attr('string'),
  x:          DS.attr('number'),
  y:          DS.attr('number'),
  custom:     DS.attr('boolean', { defaultValue: true }),
  createdAt:  DS.attr('date'),
  updatedAt:  DS.attr('date'),
  enabled:    DS.attr('boolean', { defaultValue: true }),
  area:       DS.belongsTo('area'),
  orders:     DS.hasMany('order'),

  shortname: Ember.computed('name', function(){
    const name = this.get('name');
    return name.length > 12 ? name.substring(0, 12) + "…" : name;
  }),

  orderitems: Ember.computed('orders', 'orders.@each.table', function () {
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
  }),
  type: 'table'
});
