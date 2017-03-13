import { expect } from 'chai';
import { describeModule, it } from 'ember-mocha';

describeModule('service:session-payload', 'Unit | Service | session payload',
  {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  },
  function() {
    // Replace this with your real tests.
    it('exists', function() {
      const service = this.subject();
      expect(service).to.be.ok;
    });
  }
);
