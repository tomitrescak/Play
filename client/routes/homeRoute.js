FlowRouter.route("/", {
  name: "home",
  action: function(params) {
    BlazeLayout.render("mainLayout", {content: "home"});
  }
});

// var HomeController = RouteController.extend({
//   template: 'home'
// });
//
// Router.map(function () {
//   this.route('home', {
//     path :  '/',
//     controller :  HomeController
//   });
// });
//
// Router.onBeforeAction(function () {
//   // all properties available in the route function
//   // are also available here such as this.params
//
//   if (!Meteor.user()) {
//     // if the user is not logged in, render the Login template
//     this.render('home');
//   }
// });
