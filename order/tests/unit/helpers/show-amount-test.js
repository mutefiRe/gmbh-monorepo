import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import {
  showAmount
} from 'gmbh/helpers/show-amount';

describe('ShowAmountHelper', function() {
  // Replace this with your real tests.
  it('works', function() {
    let result = showAmount([42]);
    expect(result).to.be.ok;
  });
});
