import { expect } from 'chai';
import { describeModule, it } from 'ember-mocha';

const sessionStub = Ember.Service.extend({
  getId(){
    return 1
  }
});

describeModule('controller:order', 'Unit | Controller | order',
  {
    // Specify the other units that are required for this test.
     needs: ['model:user']
  },
  function() {
    beforeEach(function() {
      this.register('service:session-payload', sessionStub);
      this.inject.service('session-payload')
    });
    // Replace this with your real tests.
    it('exists', function() {
      let controller = this.subject();
      expect(controller).to.be.ok;
    });
  }
);
