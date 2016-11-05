import DS from 'ember-data';

export default DS.Model.extend({
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  isPaid: DS.attr('boolean'),
  totalAmount: DS.attr('number'),
  user: DS.belongsTo('user'),
  table: DS.belongsTo('table'),
  orderitems: DS.hasMany('orderitem')
});
