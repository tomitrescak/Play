FlowRouter.route("/blog/:postId", {
  name: "blogPost",
  action: function(params) {
    console.log("This is my blog post:", params.postId);
  }
});

FlowRouter.route("/upload/:folder/:file", {
  name: "upload"
});

FlowRouter.route("/game/modify/:urlTitle?/:_id?", {
  name: "modifyGame",
  action: function(params) {
    BlazeLayout.render("authLayout", {content: "uploadGame" });
  }
});

FlowRouter.route("/game/:urlTitle?/:_id?", {
  name: "game",
  action: function(params) {
    BlazeLayout.render("mainLayout", { content: "gameLoader" });
  }
});

FlowRouter.route("/games", {
  name: "games",
  action: function(params) {
    BlazeLayout.render("mainLayout", { content: "contentList" });
  }
});


// Router.map(function () {
//   this.route("dashboard", {
//     path :  "/dashboard"
//   });
//
//   this.route("uploadGame", {
//     path :  "/game/upload",
//     data: function() {
//       return new Content();
//     }
//   });
//
//
//   this.route("channel", {
//     path :  "/channel/user/public/:userId/",
//     template: "contentList",
//     waitOn: function() {
//       return Meteor.subscribe("channelData", this.params.userId);
//     },
//     data: function() {
//       return {
//         items: Contents.find({}, {sort: {rating: -1}}),
//         title: "My Channel"
//       }
//     }
//   });
//
//   this.route("games", {
//     path :  "/games",
//     template: "contentList",
//     waitOn: function() {
//       return Meteor.subscribe("games");
//     },
//     data: function() {
//       return {
//         items: Contents.find({}, {sort: {rating: -1}}),
//         title: "Games"
//       }
//     }
//   });
//
//   this.route("game", {
//     path :  "/game/:urlTitle/:id",
//     template: "game",
//     waitOn: function() {
//       return [
//         Meteor.subscribe("game", this.params.id),
//         Meteor.subscribe("reviews", this.params.id)
//       ];
//     },
//     data: function() {
//       return Contents.findOne()
//     }
//   });
//
// });
