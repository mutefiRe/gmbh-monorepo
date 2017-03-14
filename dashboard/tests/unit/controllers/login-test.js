import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupTest } from 'ember-mocha';
// import { currentSession } from 'admin/tests/helpers/ember-simple-auth';

describe('Unit | Controller | login', function() {
  setupTest('controller:login', {
    // Specify the other units that are required for this test.
    // needs: ['controller:login']
  });

  // Replace this with your real tests.
  it('has no error message @ init', function() {
    const controller = this.subject();
    expect(controller.get('errorMessage')).to.equal(undefined);
  });
});
