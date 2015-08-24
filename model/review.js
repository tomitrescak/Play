Reviews = new Mongo.Collection("review");

Meteor.methods({
  review: function(id, version, text) {
    version == null ? "1.0" : version;
    Reviews.upsert({
      contentId: id,
      ownerId: Meteor.userId(),
      version: version
    }, {
      contentId: id,
      ownerId: Meteor.userId(),
      owner: Meteor.user().profile.name,
      version: version,
      reviewDate: new Date(),
      review: text
    })
  }
});
