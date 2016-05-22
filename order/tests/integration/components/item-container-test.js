/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'item-container',
  'Integration: ItemContainerComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#item-container}}
      //     template content
      //   {{/item-container}}
      // `);

      this.render(hbs`{{item-container}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
