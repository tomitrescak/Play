Meteor.startup(function () {
  Meteor.uploadDirectory = process.env.PWD + '/.uploads/';

  ApplicationFileServer.init('uploads', Meteor.uploadDirectory);
});