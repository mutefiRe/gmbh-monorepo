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

describe('Acceptance: Transition', function () {
  let application;

  beforeEach(function () {
    application = startApp();

    visit('/login');
    fillIn('#identification', 'admin');
    fillIn('#password', 'abc');
    click('button');
  });

  afterEach(function () {
    destroyApp(application);
  });

  // admin
  it('admin: visit /', function () {
    visit('/');

    andThen(function () {
      expect(currentPath()).to.equal('dashboard.index');
    });
  });


  it('admin: visit /random', function () {
    visit('/asdjflks/sdjfß0923ß49');

    andThen(function () {
      expect(currentPath()).to.equal('dashboard.index');
    });
  });

  it('admin: visit /order', function () {
    visit('/order');

    andThen(function () {
      expect(currentPath()).to.equal('dashboard.index');
    });
  });

  it('admin: visit /dashboard', function () {
    visit('/dashboard');

    andThen(function () {
      expect(currentPath()).to.equal('dashboard.index');
    });
  });


  it('admin: visit /dashboard/items', function () {
    visit('/dashboard/items');

    andThen(function () {
      expect(currentPath()).to.equal('dashboard.items');
    });
  });

  it('admin: visit /dashboard/settings', function () {
    visit('/dashboard/settings');

    andThen(function () {
      expect(currentPath()).to.equal('dashboard.settings');
    });
  });

  it('admin: visit /dashboard/stats', function () {
    visit('/dashboard/stats');

    andThen(function () {
      expect(currentPath()).to.equal('dashboard.stats');
    });
  });

  it('admin: visit /dashboard/tables', function () {
    visit('/dashboard/tables');

    andThen(function () {
      expect(currentPath()).to.equal('dashboard.tables');
    });
  });

  it('admin: visit /dashboard/users', function () {
    visit('/dashboard/users');

    andThen(function () {
      expect(currentPath()).to.equal('dashboard.users');
    });
  });
});
