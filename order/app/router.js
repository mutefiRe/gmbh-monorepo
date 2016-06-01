import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function () {
  this.route('login'); // domain/login
  this.route('user', function () {
    this.route('profile', {path: ':userID'});
  });
  this.route('dashboard', function () {
    this.route('items');
    this.route('users');
    this.route('tables');
    this.route('stats');
    this.route('settings');
  });
  this.route('order');
});

export default Router;
