import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit | Controller | login', function() {
  setupTest('controller:login', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  it('exists', function() {
    const controller = this.subject();
    expect(controller).to.be.ok;
  });
});
