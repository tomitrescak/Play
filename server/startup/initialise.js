Meteor.startup(function() {
  //Meteor.uploadDirectory = process.env.PWD + '/.uploads/';
  // ApplicationFileServer.init('uploads', Meteor.uploadDirectory);

  if (!process.env.UPLOAD_DIR) {
    process.env.UPLOAD_DIR = process.env.PWD + "/.uploads/";
  }

  UploadServer.init({
    tmpDir: process.env.UPLOAD_DIR + "/tmp",
    uploadDir: process.env.UPLOAD_DIR,
    checkCreateDirectories: true,
    getDirectory: function(fileInfo, formData) {
      // create a sub-directory in the uploadDir based on the content type (e.g. 'images')
      return new Date().getFullYear().toString();
    },
    getFileName: function(fileInfo, formData) {
      return formData.userId + "_" + fileInfo.name;
    }
  });
});
