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


  });

  afterEach(function () {
    destroyApp(application);
  });

  // waiter
  it('admin: visit /', function () {
    visit('/login');
    fillIn('#identification', 'waiter');
    fillIn('#password', 'abc');
    click('button');

    // visit('/');

    andThen(function () {
      expect(currentPath()).to.equal('order');
    });
  });


  // it('admin: visit /random', function () {
  //   visit('/asdjflks/sdjfß0923ß49');

  //   andThen(function () {
  //     expect(currentPath()).to.equal('order');
  //   });
  // });

  // it('admin: visit /order', function () {
  //   visit('/order');

  //   andThen(function () {
  //     expect(currentPath()).to.equal('order');
  //   });
  // });

  // it('admin: visit /dashboard', function () {
  //   visit('/dashboard');

  //   andThen(function () {
  //     expect(currentPath()).to.equal('order');
  //   });
  // });


  // it('admin: visit /dashboard/items', function () {
  //   visit('/dashboard/items');

  //   andThen(function () {
  //     expect(currentPath()).to.equal('order');
  //   });
  // });

  // it('admin: visit /dashboard/settings', function () {
  //   visit('/dashboard/settings');

  //   andThen(function () {
  //     expect(currentPath()).to.equal('order');
  //   });
  // });

  // it('admin: visit /dashboard/stats', function () {
  //   visit('/dashboard/stats');

  //   andThen(function () {
  //     expect(currentPath()).to.equal('order');
  //   });
  // });

  // it('admin: visit /dashboard/tables', function () {
  //   visit('/dashboard/tables');

  //   andThen(function () {
  //     expect(currentPath()).to.equal('order');
  //   });
  // });

  // it('admin: visit /dashboard/users', function () {
  //   visit('/dashboard/users');

  //   andThen(function () {
  //     expect(currentPath()).to.equal('order');
  //   });
  // });
});
