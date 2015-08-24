// Router.configure({
//   layoutTemplate: 'basicLayout',
//   notFoundTemplate: 'notFound',
//   yieldTemplates: {
//     'header': { to: 'header' },
//     'footer': { to: 'footer' }
//   }
// });

PostSubs = new SubsManager();

FlowRouter.notFound = {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "notFound"});
  }
};
