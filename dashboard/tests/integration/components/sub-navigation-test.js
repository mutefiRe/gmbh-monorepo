import { expect } from 'chai';
import { describeComponent, it } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent('sub-navigation', 'Integration | Component | sub navigation',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#sub-navigation}}
      //     template content
      //   {{/sub-navigation}}
      // `);

      this.render(hbs`{{sub-navigation}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
