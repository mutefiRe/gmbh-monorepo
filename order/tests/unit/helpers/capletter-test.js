import { expect } from 'chai';

import { describe, it } from 'mocha';
import { capletter } from 'gmbh/helpers/capletter';

describe('Unit | Helper | capletter', function() {
  it('works', function() {
    const result = capletter(['ipsum']);
    expect(result).to.be.ok;
  });

  it('returns only first letter capitalized', function(){
    const result = capletter(['ipsum']);
    expect(result).to.eq('I');
  });

  it('returns empty string when empty', function(){
    const result = capletter(['']);
    expect(result).to.eq('');
  });

  it('returns empty string when params empty', function(){
    const result = capletter([]);
    expect(result).to.eq('');
  });
});
