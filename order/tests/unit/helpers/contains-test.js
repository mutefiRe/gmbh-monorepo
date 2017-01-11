import { expect } from 'chai';

import { describe, it } from 'mocha';
import { contains } from 'gmbh/helpers/contains';

describe('Unit | Helper | contains', function() {
  // Replace this with your real tests.
  it('works', function() {
    let result = contains(['IPSUM', 'ipsum']);
    expect(result).to.be.ok;
  });
});

