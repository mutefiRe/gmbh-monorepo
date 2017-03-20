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
  })
});

