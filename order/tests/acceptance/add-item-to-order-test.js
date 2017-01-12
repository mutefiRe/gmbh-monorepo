import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

describe('Acceptance | add item to order', function() {
  let application;

  beforeEach(function() {
    application = startApp();
    server.createList('user', 1);
    server.createList('area', 1);
    server.createList('item', 1);
    server.createList('user', 1);
  });

  afterEach(function() {
    destroyApp(application);
  });

  it('can visit /order', function() {
    loggedIn();

    andThen(() => {
      expect(currentURL()).to.equal('/order');
    });
  });

  it('can visit /order', function() {
    loggedIn();

    andThen(() => {
      expect(currentURL()).to.equal('/order');
    });
  });
});
