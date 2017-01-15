import { expect } from 'chai';

import { describe, it } from 'mocha';
import { capletter } from 'gmbh/helpers/capletter';

describe('Unit | Helper | capletter', function() {
  // Replace this with your real tests.
  it('works', function() {
    let result = capletter(['ipsum']);
    expect(result).to.be.ok;
  });
});

