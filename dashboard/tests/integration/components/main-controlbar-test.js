import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | main controlbar', function() {
  setupComponentTest('main-controlbar', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#main-controlbar}}
    //     template content
    //   {{/main-controlbar}}
    // `);

    this.render(hbs `{{main-controlbar}}`);
    expect(this.$()).to.have.length(1);
  });
});
