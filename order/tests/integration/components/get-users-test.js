import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration: GetUsersComponent', function () {
  setupComponentTest('get-users', {
    integration: true
  });

  it('renders', function () {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#get-users}}
    //     template content
    //   {{/get-users}}
    // `);

    this.render(hbs`{{get-users}}`);
    expect(this.$()).to.have.length(1);
  });
});
