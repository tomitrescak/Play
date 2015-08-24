Template.gameLoader.onCreated(function() {
  var self = this;
  self.ready = new ReactiveVar();
  self.autorun(function() {
    var handle1 = PostSubs.subscribe("game", FlowRouter.getParam("_id"));
    var handle2 = PostSubs.subscribe("reviews", FlowRouter.getParam("_id"));
    self.ready.set(handle1.ready() && handle2.ready());
  });
});

Template.gameLoader.helpers({
  itemsReady: function() {
    return Template.instance().ready.get();
  },
  gameItem: function() {
    return new Content(Contents.findOne(FlowRouter.getParam("_id")));
  }
});


Template.game.events({
  'submit form': function(e) {
    e.preventDefault();
    this.review($('#review').val());
  }
});

Template.game.helpers({
  reviews: function() {
    return Reviews.find();
  },
  icon: function() {
    if (this.screens && this.screens.length >0) {
      return this.screens[0].file;
    }
  },
  niceTime: function() {
    return moment(this.reviewDate).fromNow();
  },
  roundedRating: function() {
    return Math.round(this.averageRating);
  }
})

Template.game.rendered = function() {
  var that = this;
  var isInteractive = this.data.ownerId !== Meteor.userId();

  this.data.viewed();

  $('.ui.rating')
    .rating({
      interactive: isInteractive,
      onRate: function(rating) {
        that.data.rate(rating);
      }
    })
  ;

  $('.ui.form')
    .form({
      review: {
        identifier: 'review',
        rules: [
          {
            type: 'empty',
            prompt: T9n.get('fieldRequired')
          }
        ]
      }
    }, {
      inline : true,
      on     : 'blur'
    });
}