import DS from 'ember-data';

export default DS.Model.extend({
  createdAt:  DS.attr('date'),
  updatedAt:  DS.attr('date'),
  number:     DS.attr('number'),
  user:       DS.belongsTo('user'),
  table:      DS.belongsTo('table'),
  orderitems: DS.hasMany('orderitem'),

  showNumber: Ember.computed('number', function(){
    return this.get('number') || 'Noch nicht abgesendet!';
  }),
  openAmount: Ember.computed('orderitems.@each.count', 'orderitems', function () {
    const orderitems = this.get('orderitems').toArray();
    let sum = 0;
    for (const orderitem of orderitems) {
      sum += orderitem.get('price') * (orderitem.get('count') - orderitem.get('countPaid'));
    }
    return sum;
  }),
  type: 'order'
});
