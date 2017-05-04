import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  actions: {
    openCloseEditable() {
      if (this.$().hasClass('open')) {
        this.$().find('.editarea').slideToggle(
          () => {
            this.$().removeClass('open');
          });
        this.$().find('.singleeditindicator').html('mode_edit');
        $('body').removeClass('noscroll');
      } else {
        this.$().addClass('open');
        this.$().find('.editarea').slideToggle(function(){});
        this.$().find('.singleeditindicator').html('keyboard_arrow_down');
        $('body').addClass('noscroll');
      }
    },
    updateUser(user) {
      user.save();
    }
  }
});
