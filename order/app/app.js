import Ember from 'ember';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

Ember.MODEL_FACTORY_INJECTIONS = true;

const App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

loadInitializers(App, config.modulePrefix);

Ember.onerror = function(error) {
  console.log(error)
  const data = {
    app: 'order',
    message: error.message
  };
  Ember.$.ajax({
    url: window.EmberENV.host + '/error',
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json'
  });
};

export default App;
