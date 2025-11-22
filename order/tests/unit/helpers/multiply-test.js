import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import {
  multiply
} from 'gmbh/helpers/multiply';

describe('MultiplyHelper', function() {
  it('works', function() {
    expect(multiply([1,2])).to.eq(2);
  });

  it('multiplies 2 params', function() {
    expect(multiply([7,6])).to.eq(42);
  });

  it('multiplies 2 params', function() {
    expect(multiply([8,9])).to.eq(72);
  });

  it('multiplies 2 params', function() {
    expect(multiply([0,6])).to.eq(0);
  });
});
