var fs = Npm.require("fs");
var path = Npm.require("path");
var Future = Npm.require("fibers/future");

var deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

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
  },
  processWebFile: function(contentId, filePath) {
    check(filePath, String);

    filePath = makeSafeFileName(filePath);

    var serverPath = path.join(process.env.UPLOAD_DIR, filePath);
    var extension = path.extname(filePath);

    if (extension.toLowerCase() != ".zip") {
      fs.unlinkSync(serverPath);
      throw new Meteor.Error("We can only process .zip files (no RAR, 7Z ...)");
    }

    var dir = path.dirname(filePath);
    var webDir = path.basename(filePath, ".zip") + "-Web";
    var relativeDir = path.join(dir, webDir);
    var outputDir = path.join(process.env.UPLOAD_DIR, relativeDir);

    // remove this directory if exists and recreate it
    deleteFolderRecursive(outputDir);
    fs.mkdir(outputDir);

    // in case there was a previous version, remove it
    var webBuild = Contents.findOne(contentId).webBuild;
    if (webBuild) {
      deleteFolderRecursive(path.join(process.env.UPLOAD_DIR, path.dirname(webBuild)));
    }


    var fut = new Future();
    var bound_callback = Meteor.bindEnvironment(function(err, res) {
      if (err) {
        fut.throw(err);
      }

      // find the .unity3d file'
      var unityFile = null;
      fs.readdirSync(outputDir).forEach(function(file, index) {
        if (path.extname(file) == ".unity3d") {
          unityFile = file;
          return true;
        }
      });

      if (!unityFile) {
        fs.unlinkSync(serverPath);
        deleteFolderRecursive(outputDir);
        fut.throw(
          new Meteor.Error("Your zip file does not contain '.unity3d' file. Are you sure you packed it correctly?")
        );
      }

      // update content
      Contents.update(contentId, {
        $set: {
          webBuild: path.join(relativeDir, unityFile)
        }
      });
      fs.unlinkSync(serverPath);

      fut.return(true);
    });

    // extract zip
    try {
      extractZip(serverPath, outputDir, true, bound_callback);
      fut.wait();
    } catch (ex) {
      fs.unlinkSync(serverPath);
      deleteFolderRecursive(outputDir);
      throw new Meteor.Error("Error processing zip file: " + ex);
    }
    // return true;
  }
})
