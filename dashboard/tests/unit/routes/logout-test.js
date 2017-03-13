import { expect } from 'chai';
import { describeModule, it } from 'ember-mocha';

describeModule('route:logout', 'Unit | Route | logout',
  {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  },
  function() {
    it('exists', function() {
      const route = this.subject();
      expect(route).to.be.ok;
    });
  }
);
