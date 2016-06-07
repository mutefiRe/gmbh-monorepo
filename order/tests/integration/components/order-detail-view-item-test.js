/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'order-detail-view-item',
  'Integration: OrderDetailViewItemComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#order-detail-view-item}}
      //     template content
      //   {{/order-detail-view-item}}
      // `);

      this.render(hbs`{{order-detail-view-item}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
