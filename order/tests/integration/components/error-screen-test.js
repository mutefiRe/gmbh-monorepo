/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'error-screen',
  'Integration: ErrorScreenComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#error-screen}}
      //     template content
      //   {{/error-screen}}
      // `);

      this.render(hbs`{{error-screen}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
