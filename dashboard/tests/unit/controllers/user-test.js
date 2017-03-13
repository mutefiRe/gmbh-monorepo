import { expect } from 'chai';
import { describeModule, it } from 'ember-mocha';

describeModule('controller:user', 'Unit | Controller | user',
  {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  },
  function() {
    // Replace this with your real tests.
    it('exists', function() {
      const controller = this.subject();
      expect(controller).to.be.ok;
    });
  }
);
