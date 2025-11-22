import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('areas');
  this.route('categories');
  this.route('events');
  this.route('login');
  this.route('logout');
  this.route('printers');
  this.route('products');
  this.route('statistics');
  this.route('tables');
  this.route('units');
  this.route('users');
});

export default Router;
