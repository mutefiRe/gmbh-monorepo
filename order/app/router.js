import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function () {
  this.route('login'); // domain/login
  this.route('order');

  // not defined routes ("404")
  this.route('login', {
    path: '*path'
  });
});

export default Router;
