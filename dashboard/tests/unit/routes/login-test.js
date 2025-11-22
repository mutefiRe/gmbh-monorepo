import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit | Route | login', function() {
  setupTest('route:login', {
    // Specify the other units that are required for this test.
    // needs: ['controller:login']
  });

  it('exists', function() {
    const route = this.subject();
    expect(route).to.be.ok;
  });
});
