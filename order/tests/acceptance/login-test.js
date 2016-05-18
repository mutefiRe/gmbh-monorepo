import {
  describe,
  it,
  beforeEach,
  afterEach
} from 'mocha';
import { expect } from 'chai';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

describe('Acceptance: Login', function() {
  let application;

  beforeEach(function() {
    application = startApp();
  });

  afterEach(function() {
    destroyApp(application);
  });

  it('can visit /login', function() {
    visit('/login');

    andThen(() => expect(currentPath()).to.equal('login'));
  });

  it('redirect after login', function() {
    server.create('user', { username: 'test', password: 'test' });
    visit('/login');
    fillIn('#identification', 'test');
    fillIn('#password', 'test');
    click('button')
    andThen(() => expect(currentPath()).to.equal('index'))
  })

  it('no redirect after wrong login', function() {
    visit('/login');
    //user "no" is hardcoded in mirage data for fail
    fillIn('#identification', 'no');
    fillIn('#password', 'terriblewrongpassword');
    click('button')
    andThen(() => expect(currentPath()).to.equal('login'))
  });
});
