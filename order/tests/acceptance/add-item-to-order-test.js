import { describe, it, beforeEach, afterEach } from 'mocha';

import { expect } from 'chai';
import startApp   from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

describe('Acceptance | add item to order', function() {
  let application;

  beforeEach(function() {
    application = startApp();

    const category = server.create('category');
    const unit     = server.create('unit');
    server.create('item', {category, unit});
    server.createList('item', 10, {category, unit});

    server.create('user');
    server.create('area');
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
      expect(currentURL()).to.equal('/order');
      click("div.single-item:first-child");
      andThen(() => {
        expect(find('.preview-list>li:first-child').html()).to.equal('<div class="caption">1I</div>');
      });
    });
  });
});
