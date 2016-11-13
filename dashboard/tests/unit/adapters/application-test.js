import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Application Adapter', function() {
  setupTest('adapter:application', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  it('exists', function() {
    var adapter = this.subject();
    expect(adapter).to.be.ok;
  });
});