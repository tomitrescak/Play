Template.game.events({
  'submit form': function(e) {
    e.preventDefault();
    this.review($('#review').val());
  }
})

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