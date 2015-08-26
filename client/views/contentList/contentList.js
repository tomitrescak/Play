
function getUserId() {
  var userId = FlowRouter.getParam("userId");
  if (!userId) {
    userId = Meteor.userId();
  }
  return Meteor.userId();
}

Template.contentList.onCreated(function() {
  var self = this;
  self.ready = new ReactiveVar();
  self.autorun(function() {
    if (self.data.userOwned) {
      var handle = PostSubs.subscribe("channelData", getUserId());
      self.ready.set(handle.ready());
    } else {
      var handle = PostSubs.subscribe("games");
      self.ready.set(handle.ready());
    }
  });
});

Template.contentList.helpers({
  items: function() {
    // var userId = Meteor.userId();
    // if (FlowRouter.getParam("userId")) {
    //   userId = FlowRouter.getParam("userId");
    // }
    if (this.userOwned) {
      return Contents.find({ ownerId: getUserId() }, {sort: {rating: -1}});
    }
    return Contents.find({}, {sort: {rating: -1}});
  },
  itemsReady: function() {
    return Template.instance().ready.get();
  }
});

Template.contentListItem.rendered = function() {
  $("#rating-" + this.data._id).rating({
    interactive: false,
    initialRating: this.data.averageRoundedRating
  });
};

Template.contentListItem.helpers({
  isOwner: function() {
    return this.ownerId == Meteor.userId();
  },
  modifyGameParams: function() {
    return {
      _id: this._id,
      urlTitle: this.title.replace(/\s/, "-")
    }
  }
});

Template.screenshot.helpers({
  screenShot: function() {
    if (this.screens.length > 0) {
      return this.screens[0].file;
    }
    return null;
  }
});
