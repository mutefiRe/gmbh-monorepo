/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'single-item',
  'Integration: SingleItemComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#single-item}}
      //     template content
      //   {{/single-item}}
      // `);

      this.render(hbs`{{item}}`);
      expect(this.$()).to.have.length(1);
    });
  }
  );
