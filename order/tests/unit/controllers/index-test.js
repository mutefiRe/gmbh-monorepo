import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupTest } from 'ember-mocha';

const sessionStub = Ember.Service.extend({
  getId(){
    return 1;
  }
});

describe('Unit | Controller | index', function() {
  setupTest('controller:index', {
    // Specify the other units that are required for this test.
    needs: ['model:user']
  });

  beforeEach(function() {
    this.register('service:session-payload', sessionStub);
    this.inject.service('session-payload');
  });
  // Replace this with your real tests.
  it('exists', function() {
    const controller = this.subject();
    expect(controller).to.be.ok;
  });
});
