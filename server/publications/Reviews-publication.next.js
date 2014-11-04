Meteor.publish('reviews', (contentId) => {
  return Reviews.find({contentId: contentId});
});