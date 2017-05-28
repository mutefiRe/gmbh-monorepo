import { describe, it, beforeEach, afterEach } from 'mocha';

import { expect } from 'chai';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

describe('Acceptance | index screen', function() {
  this.timeout(5000);
  let application;

  beforeEach(function() {
    application = startApp();

    const printer  = server.create('printer');
    const category = server.create('category', {printer});
    const unit     = server.create('unit');
    server.create('item', {category, unit});
    server.createList('item', 10, {category, unit});

    server.create('user');
    server.create('area');
    server.create('setting');
    server.create('table');

  });

  afterEach(function() {
    destroyApp(application);
  });

  it('can visit index', function() {
    loggedIn();

    andThen(() => {
      expect(currentURL()).to.equal('/');
    });
  });

  it('can click on item', function() {
    loggedIn();
    andThen(() => {
      expect(currentURL()).to.equal('/');
      click("div.product_single-item:first-child");
      andThen(() => {
        expect(find('.preview > li:first-child').html()).to.equal('<div class="caption">1I</div>');
      });
    });
  });

  it('can click on different items', function() {
    loggedIn();
    andThen(() => {
      click("div.product_single-item:first-child");
      click("div.product_single-item:nth-child(2)");
      click("div.product_single-item:nth-child(2)");
      andThen(() => {
        expect(find('.preview > li:first-child').html()).to.equal('<div class="caption">1I</div>');
        expect(find('.preview > li:nth-child(2)').html()).to.equal('<div class="caption">2I</div>');
      });
    });
  });

  it('can choose a table in desktop view without item. No Send Button should appear', function() {
    loggedIn();
    andThen(() => {
      click("div.menu--desktop button.bigbutton:first-child");
      andThen(() => {
        click("div.table-mask > div:first");
        andThen(() => {
          expect(find("div.menu--desktop span").html()).to.equal("Bestellung ist leer!");
        });
      });
    });
  });

  it('can choose a table in desktop view with item. Send button should appear', function() {
    loggedIn();
    andThen(() => {
      click("div.product_single-item:first-child");
      click("div.menu--desktop button.bigbutton:first-child"); // Tisch auswählen
      andThen(() => {
        click("div.table-mask > div:first"); // Erster Tisch
        andThen(() => {
          expect(find("div.menu--desktop button.bigbutton:first").html()).to.equal("Abschicken");
        });
      });
    });
  });
});