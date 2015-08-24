Meteor.publish("reviews", function (contentId) {
  return Reviews.find({contentId: contentId});
});
