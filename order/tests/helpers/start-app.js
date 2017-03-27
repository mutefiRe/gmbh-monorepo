import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';
import './logged-in';

export default function startApp(attrs) {
  let application;

  // use defaults, but you can override
  const attributes = Ember.assign({}, config.APP, attrs);

  Ember.run(() => {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}
