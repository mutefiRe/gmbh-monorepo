/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'single-category',
  'Integration: SingleCategoryComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#single-category}}
      //     template content
      //   {{/single-category}}
      // `);

      this.render(hbs`{{single-category}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
