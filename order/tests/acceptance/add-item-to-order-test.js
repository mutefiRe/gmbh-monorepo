import { describe, it, beforeEach, afterEach } from 'mocha';

import { expect } from 'chai';
import startApp   from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

describe('Acceptance | add item to order', function() {
  let application;

  beforeEach(function() {
    application = startApp();

    server.create('user');
    server.create('area');
    const category = server.create('category');
    const unit = server.create('unit');
    const item = server.createList('item', 10, {category, unit});
    server.create('setting');
    server.create('table');
    server.create('printer');
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

  it('can click on item', function() {
    loggedIn();


    andThen(() => {
      console.log(find("div.single-item"))
      click("div.single-item:first-child");
      expect(currentURL()).to.equal('/order');
      console.log(find('.preview-list li:first'));
      expect(find('.preview-list>li:first-child').text()).to.equal('blaah');
    });
  });
});
