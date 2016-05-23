/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'category-selection',
  'Integration: CategorySelectionComponent',
  {
    integration: true
  },
  function () {
    it('renders', function () {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#category-selection}}
      //     template content
      //   {{/category-selection}}
      // `);

      this.render(hbs`{{category-selection}}`);
      expect(this.$()).to.have.length(1);
    });
  }
  );
