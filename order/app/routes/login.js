import Ember from 'ember';

var user = {
  id: 1,
  firstName: "Thomas",
  lastName: "Stütz",
  password: ""
}

export default Ember.Route.extend({
  model(){
    return user
  }
});
