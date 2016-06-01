import Ember from 'ember';

export default Ember.Route.extend({
model(){
  return Ember.RSVP.hash({
    categories: this.store.findAll('category'),
    Items: this.store.findAll('item'),
    Units: this.store.findAll('unit'),
    Orders: this.store.findAll('order'),
    Orderitems: this.store.findAll('orderitem')
  });
 }
});
