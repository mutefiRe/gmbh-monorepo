import Ember from 'ember';

export default Ember.Service.extend({
  routing: Ember.inject.service('-routing'),
  isSwiping: false,
  toScreen(input) {
    const {screen} = input;
    if(this.get('routing').hasRoute(screen)){
      this.routeTransition(input, this.get('routing'));
    }else{
      this.screenTransition(input, this);
    }

  },
  routeTransition(input, routing){
    const {screen, from} = input;
    Ember.$('.isActive').css({
      'left': 'unset',
      'right': 'unset',
      [from]: '0%'
    }).animate({
      [from]: '100%'
    },200,'linear',function(){
      $(this).removeClass('isActive').css({
        [from]: 'unset'
      });
      routing.transitionTo(screen);
    });

  },
  screenTransition(input, that){
    const {from, screen} = input;
    const swiping = that.get('isSwiping');

    if(!swiping){
      that.set('isSwiping',true);

      Ember.$('.isActive').css({
        'left': 'unset',
        'right': 'unset',
        [from]: '0%'
      }).animate({
        [from]: '100%'
      },200,'linear',function(){
        $(this).removeClass('isActive').css({
          [from]: 'unset'
        });
      });

      Ember.$('.' + screen).addClass('isActive').css({
        'left': 'unset',
        'right': 'unset',
        [from]: '-100%'
      }).animate({
        [from]: '0%'
      },200,'linear',() => {
        that.set('isSwiping', false);
      });

    }

  }

});
