import { expect } from 'chai';
import { describe, it } from 'mocha';
import { contains } from 'gmbh/helpers/contains';

describe('Unit | Helper | contains', function() {
  // Replace this with your real tests.
  it('works', function() {
    const result = contains(['IPSUM', 'ipsum']);
    expect(result).to.be.ok;
  });

  it('different words are false', function() {
    const result = contains(['lorem', 'ipsum']);
    expect(result).to.eq(false);
  });

  it('same words are true', function() {
    const result = contains(['ipsum', 'ipsum']);
    expect(result).to.eq(true);
  });

  it('same words with different Caps are true', function() {
    const result = contains(['IPSUM', 'ipsum']);
    expect(result).to.eq(true);
  });
});

