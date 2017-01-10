import { expect } from 'chai';
import { describeComponent, it } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent('navigation-element', 'Integration | Component | navigation element',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#navigation-element}}
      //     template content
      //   {{/navigation-element}}
      // `);

      this.render(hbs`{{navigation-element}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
