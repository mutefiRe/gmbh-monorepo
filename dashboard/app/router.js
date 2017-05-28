import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('login');
  this.route('logout');
  this.route('data', function(){});
  this.route('categories');
  this.route('users');
  this.route('printers');
  this.route('events');
  this.route('products');
  this.route('tables');
  this.route('areas');
  this.route('statistics');
});

export default Router;
