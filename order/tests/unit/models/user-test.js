/* jshint expr:true */
import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupModelTest } from 'ember-mocha';

describe('Unit | Model | user', function () {
  setupModelTest('user', {
    // Specify the other units that are required for this test.
    needs: ['model:area']
  });

  // Replace this with your real tests.
  it('exists', function () {
    let model = this.subject();
    expect(model).to.be.ok;
  });
});
