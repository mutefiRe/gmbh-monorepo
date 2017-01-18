import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupTest } from 'ember-mocha';
import { authenticateSession } from 'gmbh/tests/helpers/ember-simple-auth';

describe('ApplicationController', function () {
  setupTest('controller:application', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
    //  needs: ['application']
  });

  it('exists', function () {
    let controller = this.subject();
    expect(controller).to.be.ok;
  });

  it('no session is set', function () {
    let controller = this.subject();
    expect(controller.get('currentUser')).to.be.false;
  });
});
