import Ember from 'ember';

export default Ember.Test.registerAsyncHelper('loggedIn', function() {
  visit('/login');
  andThen(function () {
    fillIn('#identification', 'waiter_1');
    fillIn('#password', 'abc');
    click('button');
  });
});
