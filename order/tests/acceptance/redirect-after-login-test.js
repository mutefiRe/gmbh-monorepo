/* jshint expr:true */
import {
  describe,
  it,
  beforeEach,
  afterEach
} from 'mocha';
import {expect} from 'chai';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

describe('Acceptance: RedirectAfterLogin', function () {
  let application;

  beforeEach(function () {
    application = startApp();
  });

  afterEach(function () {
    destroyApp(application);
  });

  it('redirect admin to dashboard after login', function () {
    visit('/login');
    fillIn('#identification', 'admin');
    fillIn('#password', 'pw');
    click('button');

    andThen(function () {
      expect(currentPath()).to.equal('dashboard');
    });
  });

  it('redirect waiter to order after login', function () {
    visit('/login');
    fillIn('#identification', 'waiter');
    fillIn('#password', 'pw');
    click('button');

    andThen(function () {
      expect(currentPath()).to.equal('order');
    });
  });
});
