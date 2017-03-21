import DS from 'ember-data';

export default DS.Model.extend({
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  user: DS.belongsTo('user'),
  table: DS.belongsTo('table'),
  orderitems: DS.hasMany('orderitem'),
  openAmount: Ember.computed('orderitems', function () {
    const orderitems = this.get('orderitems').toArray();
    let sum = 0;
    for (const orderitem of orderitems) {
      sum += orderitem.get('price') * (orderitem.get('count') - orderitem.get('countPaid'));
    }
    return sum;
  })
});

