import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['order-overview-item'],
  tagName: 'tr',
  classNameBindings: ['bezahlt'],
  bezahlt: function() {
    if (this.get('status') === 'bezahlt') {
      return 'bezahlt';
    }
    return 'offen';
  }.property('status')
});
