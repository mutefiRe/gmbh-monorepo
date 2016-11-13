import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Login Route', function() {
  setupTest('route:login', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  it('exists', function() {
    var route = this.subject();
    expect(route).to.be.ok;
  });
});