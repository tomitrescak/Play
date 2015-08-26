showMarkdownModal = function(raw, header) {
  var html = marked(raw);
  html = html.replace(/<table/g, "<table class=\"ui striped table\"");

  // now fill in the data
  $("#previewModalHeader").html(header);
  $("#previewModalContent").html(html);
  $("#previewModal").modal("show");

  setTimeout(function() {
    $("#previewModal").modal("refresh");
  }, 1000);
}

Template.uploadGame.onCreated(function() {
  var self = this;
  var insert = FlowRouter.getParam("_id") ? false : true;
  self.ready = new ReactiveVar(insert);

  if (!insert) {
    self.autorun(function() {
      var gameId = FlowRouter.getParam("_id");
      var handle = PostSubs.subscribe("singleContent", gameId);
      self.ready.set(handle.ready());
    });
  }
});

Template.uploadGame.helpers({
  subscriptionsReady: function() {
    return Template.instance().ready.get();
  },
  game: function() {
    var param = FlowRouter.getParam("_id");
    if (param) {
      return new Content(Contents.findOne(param));
    } else {
      return new Content();
    }
  }
});

Template.uploadGamePanel.helpers({
  overviewOrTemplate: function() {
    return this._id ? this.specification.overview : overviewTemplate;
  },
  featureSetOrTemplate: function() {
    return this._id ? this.specification.featureSet : featureSetTemplate;
  },
  gameWorldOrTemplate: function() {
    return this._id ? this.specification.gameWorld : gameWorldTemplate;
  },
  gamePlayOrTemplate: function() {
    return this._id ? this.specification.gamePlay : gamePlayTemplate;
  },
  singlePlayerGameOrTemplate: function() {
    return this._id ? this.specification.singlePlayerGame : singlePlayerGameTemplate;
  },
  multiPlayerGameOrTemplate: function() {
    return this._id ? this.specification.multiPlayerGame : multiPlayerGameTemplate;
  },
  extrasOrTemplate: function() {
    return this._id ? this.specification.extras : extrasTemplate;
  },
  uploadFormData: function(platform) {
    return {
      userId: Meteor.userId(),
      platform: platform
    }
  },
  imageCallbacks: function() {
    var self = this;
    return {
      finished: function(index, fileInfo, context) {
        self.contentUploaded("image", fileInfo.path);
      }
    }
  },
  screenshotCallbacks: function() {
    var self = this;
    return {
      finished: function(index, fileInfo, context) {
        self.contentUploaded("screenshot", fileInfo.path);
      }
    }
  },
  fileCallbacks: function() {
    var self = this;
    return {
      finished: function(index, fileInfo, context) {
        self.contentUploaded(context.data.contentType, fileInfo.path);
      }
    }
  },
  webFileCallbacks: function() {
    var self = this;
    return {
      finished: function(index, fileInfo, context) {
        Meteor.call("processWebFile", self._id, fileInfo.path, function(err, success) {
          if (err) {
            alert(err);
          } else {
            alert("Your web file has been processed successfuly!");
            self.contentUploaded(context.data.contentType, fileInfo.path);
          }
        });
      }
    }
  },
  canPublish: function() {
    return this.files.length > 1 && this.screens.length > 2;
  }
});

Template["uploadGamePanel"].events({
  "submit form": function(e) {
    e.preventDefault();

    // save the data to database
    this.title = $("#title").val();
    this.description = $("#description").val();
    this.genre = $("#genre").val();
    this.repository = $("#repository").val();
    this.contentType = "game";

    this.specification.overview = $("#overview").val();
    this.specification.featureSet = $("#featureSet").val();
    this.specification.gameWorld = $("#gameWorld").val();
    this.specification.gamePlay = $("#gamePlay").val();
    this.specification.singlePlayerGame = $("#singlePlayer").val();
    this.specification.multiPlayerGame = $("#multiPlayer").val();
    this.specification.extras = $("#extras").val();

    var self = this;
    this.save(function() {
      FlowRouter.go("modifyGame", {
        urlTitle: self.urlTitle,
        _id: self.id
      });
    });
  },
  "click #previewSpecification": function() {
    var text = $("#overview").val() +
      $("#featureSet").val() +
      $("#gameWorld").val() +
      $("#gamePlay").val() +
      $("#singlePlayer").val() +
      $("#multiPlayer").val() +
      $("#extras").val();
    showMarkdownModal(text, "Specification");
  },
  // "click #saveGame": function(e) {
  //   e.preventDefault();
  //
  //   this.save();
  // },
  "click #publishGame": function() {
    if (this.access === "public") {
      this.changeAccess("private");
      alert("Your game is now private and not visible to others ;(");
    } else {
      this.changeAccess("public");
      alert("Your game is now public for everyone to enjoy!")
    }
    // $("#successModal")
    //   .modal("show");
  },
  "click .deleteImage": function(e) {
    e.preventDefault();
    if (confirm("Do you really wish to delete this image?")) {
      Meteor.call("deleteImage",
        e.currentTarget.attributes["data-id"].value,
        this.file,
        function(err, ok) {
          if (err) {
            alert(err);
          }
        });
    }
  },
  "click .deleteScreenshot": function(e) {
    e.preventDefault();
    if (confirm("Do you really wish to delete this screenshot?")) {
      Meteor.call("deleteScreenshot",
        e.currentTarget.attributes["data-id"].value,
        this.file,
        function(err, ok) {
          if (err) {
            alert(err);
          }
        });
    }
  },
  "click .deleteFile": function(e) {
    e.preventDefault();
    if (confirm("Do you really wish to delete this file?")) {
      Meteor.call("deleteFile",
        e.currentTarget.attributes["data-id"].value,
        this.file,
        function(err, ok) {
          if (err) {
            alert(err);
          }
        });
    }
  }
});

Template["uploadGamePanel"].rendered = function() {
  $(".ui.form")
    .form({
      inline: true,
      on: "blur",
      fields: {
        title: {
          identifier: "title",
          rules: [{
            type: "empty",
            prompt: "This field is required!"
          }]
        },
        genre: {
          identifier: "genre",
          rules: [{
            type: "empty",
            prompt: "This field is required!"
          }]
        },
        description: {
          identifier: "description",
          rules: [{
            type: "empty",
            prompt: "This field is required!"
          }]
        }
      }
    });

  $(".ui.dropdown").dropdown();
  $(".menu .item").tab();
};

Template.imageList.events({
  "click .imageLink": function() {
    $("#imageHolder").attr("src", "/upload/" + this.file);
    //$("#imageDescription").html(this.file);

    $("#imageModal")
      .modal({
        blurring: true
      })
      .modal("show");
  }
})
