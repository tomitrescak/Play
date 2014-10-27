Template.contentList.rendered = function() {
  $('.ui.rating').rating({
    interactive: false
  });
}

Template["contentList"].helpers({
  screenShot: function() {
    return this.screens[0].file;
  },
  isOwner: function() {
    return this.ownerId == Meteor.userId();
  }
})