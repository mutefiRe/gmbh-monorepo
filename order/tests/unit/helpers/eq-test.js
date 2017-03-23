import { expect } from 'chai';
import { describe, it } from 'mocha';
import { eq } from 'gmbh/helpers/eq';

describe('EqHelper', function() {
  it('equal values leads to true', function() {
    const result = eq([1, 1]);
    expect(result).to.equal(true);
  });

  it('different values leads to false', function() {
    const result = eq([1, 2]);
    expect(result).to.equal(false);
  });
});
