import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function () {
  this.route('login'); // domain/login
  this.route('order');
  this.route('index', {
    path: '/'
  });
  this.route('dashboard', function () {
    this.route('items');
    this.route('users');
    this.route('tables');
    this.route('stats');
    this.route('settings');
    this.route('areas');
  });

  // not defined routes
  this.route('index', {
    path: '*path'
  });
});

export default Router;
