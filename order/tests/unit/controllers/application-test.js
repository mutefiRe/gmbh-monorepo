import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('ApplicationController', function () {
  setupTest('controller:application', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
    //  needs: ['application']
  });

  it('exists', function () {
    const controller = this.subject();
    expect(controller).to.be.ok;
  });

  it('no session is set', function () {
    const controller = this.subject();
    expect(controller.get('currentUser')).to.be.false;
  });
});
