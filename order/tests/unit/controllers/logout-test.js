/* jshint expr:true */
import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('LogoutController', function() {
  setupTest('controller:logout', {
    // Specify the other units that are required for this test.
    needs: ['service:session']
  });

  // Replace this with your real tests.
  it('exists', function() {
    let controller = this.subject({
      init() {}
    });
    expect(controller).to.be.ok;
  });
});
