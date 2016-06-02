/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'preview-list',
  'Integration: PreviewListComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#preview-list}}
      //     template content
      //   {{/preview-list}}
      // `);

      this.render(hbs`{{preview-list}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
