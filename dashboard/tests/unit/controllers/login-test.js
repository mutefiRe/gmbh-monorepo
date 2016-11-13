import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Login Controller', function() {
  setupTest('controller:login', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  it('exists', function() {
    var controller = this.subject();
    expect(controller).to.be.ok;
  });
});