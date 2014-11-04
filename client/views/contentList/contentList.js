Template["contentListItem"].rendered = function() {
  $('#rating-' + this.data._id).rating({
    interactive: false,
    initialRating: this.data.averageRoundedRating
  });
}

Template["contentListItem"].helpers({
  screenShot: function() {
    return this.screens[0].file;
  },
  isOwner: function() {
    return this.ownerId == Meteor.userId();
  }
})