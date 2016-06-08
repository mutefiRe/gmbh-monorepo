/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'dashboard/user-item',
  'Integration: AddUsersComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#dashboard/user-item}}
      //     template content
      //   {{/dashboard/user-item}}
      // `);

      this.render(hbs`{{dashboard/user-item}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
