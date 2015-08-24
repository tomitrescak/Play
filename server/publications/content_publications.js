Meteor.publish("content", function() {
  return Contents.find();
});

Meteor.publish("channelData", function(id) {
  return Contents.find({
    ownerId: id
  });
});

Meteor.publish("games", function() {
  return Contents.find({
    contentType: "game",
    access: "public"
  }, {
    sort: {
      rating: -1
    }
  });
});

Meteor.publish("game", function(id) {
  return Contents.find({
    _id: id
  });
});

Meteor.publish("singleContent", function(id) {
  return Contents.find({
    _id: id
  });
});

Meteor.methods({
  rate: function(contentId, rating) {
    // TODO: Optimise find ...
    var content = Contents.findOne(contentId);
    content.serverRate(rating);
  },

  deleteFile: function(contentId, fileName) {
    var content = Contents.findOne({
      _id: contentId,
      "files.file": fileName
    });

    if (!content) {
      throw new Meteor.Error("This content does not exists!");
    }

    var safeFileName = makeSafeFileName(fileName);

    var fs = Npm.require("fs");
    fs.unlinkSync(process.env.UPLOAD_DIR + "/" + safeFileName);

    // delete from database
    Contents.update({
      _id: contentId
    }, {
      $pull: {
        files: {
          file: fileName
        }
      }
    });
  },
  deleteImage: function(contentId, fileName) {
    var fs = Npm.require("fs");
    console.log("Deleting: " + fileName + " " + contentId);

    var content = Contents.findOne({
      _id: contentId,
      "images.file": fileName
    });

    if (!content) {
      throw new Meteor.Error("This content does not exists!");
    }

    var safeFileName = makeSafeFileName(fileName);
    var filePath = process.env.UPLOAD_DIR + "/" + safeFileName;

    // delete from database
    Contents.update({
      _id: contentId
    }, {
      $pull: {
        images: {
          file: fileName
        }
      }
    })
  },
  deleteScreenshot: function(contentId, fileName) {
    var fs = Npm.require("fs");

    var content = Contents.findOne({
      _id: contentId,
      "screens.file": fileName
    });

    if (!content) {
      throw new Meteor.Error("This content does not exists!");
    }

    var safeFileName = makeSafeFileName(fileName);
    var filePath = process.env.UPLOAD_DIR + "/" + safeFileName;

    //fs.unlinkSync(filePath);
    //fs.unlinkSync(Meteor.uploadDirectory + content.folder + "/thumbnail/" + safeFileName);

    // delete from database
    Contents.update({
      _id: contentId
    }, {
      $pull: {
        screens: {
          file: fileName
        }
      }
    })
  },
  viewed: function(id) {
    Contents.update({
      _id: id
    }, {
      $inc: {
        views: 1
      }
    });
  }
})
