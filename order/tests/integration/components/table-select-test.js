/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'table-select',
  'Integration: TableSelectComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#table-select}}
      //     template content
      //   {{/table-select}}
      // `);

      this.render(hbs`{{table-select}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
