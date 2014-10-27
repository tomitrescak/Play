Template.game.helpers({
  icon: function() {
    return this.screens[0].file;
  },
  roundedRating: function() {
    return Math.round(this.averageRating);
  }
})

Template.game.rendered = function() {
  var that = this;
  var rounded = Math.floor(that.averageRating);
  $('.ui.rating')
    .rating({
      onRate: function(rating) {
        that.data.rate(rating);
      }
    })
  ;
}