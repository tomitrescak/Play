Meteor.startup(function() {
  //Meteor.uploadDirectory = process.env.PWD + "/.uploads/";
  // ApplicationFileServer.init("uploads", Meteor.uploadDirectory);

  if (!process.env.UPLOAD_DIR) {
    process.env.UPLOAD_DIR = process.env.PWD + "/.uploads/";
  }

  UploadServer.init({
    tmpDir: process.env.UPLOAD_DIR + "/tmp",
    uploadDir: process.env.UPLOAD_DIR,
    checkCreateDirectories: true,
    getDirectory: function(fileInfo, formData) {
      // create a sub-directory in the uploadDir based on the content type (e.g. "images")
      return new Date().getFullYear().toString();
    },
    getFileName: function(fileInfo, formData) {
      return formData.userId + "_" + fileInfo.name;
    }
  });

  // By default, the email is sent from no-reply@meteor.com. If you wish to receive email from users asking for // 2
  // help with their account, be sure to set this to an email address that you can receive email at.            // 3
  Accounts.emailTemplates.from = "SCEM Play <no-reply@play.scem.uws.edu.au>";

  // The public name of your application. Defaults to the DNS name of the application (eg: awesome.meteor.com). // 6
  Accounts.emailTemplates.siteName = "Play"; // 7

  // A Function that takes a user object and returns a String for the subject line of the email.                // 9
  Accounts.emailTemplates.enrollAccount.subject =
    Accounts.emailTemplates.verifyEmail.subject = function(user, url) {
      return "[SCEM] Play - Account Creation";
    }

  Accounts.config({
    sendVerificationEmail: true,
    forbidClientAccountCreation: true
  });

});
