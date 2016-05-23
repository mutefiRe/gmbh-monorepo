/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'orderlist-item',
  'Integration: OrderlistItemComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#orderlist-item}}
      //     template content
      //   {{/orderlist-item}}
      // `);

      this.render(hbs`{{orderlist-item}}`);
      expect(this.$()).to.have.length(1);
    });
  }
  );
