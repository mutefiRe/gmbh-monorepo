/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'order-detail-view',
  'Integration: OrderDetailViewComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#order-detail-view}}
      //     template content
      //   {{/order-detail-view}}
      // `);

      this.render(hbs`{{order-detail-view}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
