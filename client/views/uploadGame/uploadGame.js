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
    console.log(this.specification);
    return this.specification.overview ? this.specification.overview : overviewTemplate;
  },
  featureSetOrTemplate: function() {
    return this.specification.featureSet ? this.specification.featureSet : featureSetTemplate;
  },
  gameWorldOrTemplate: function() {
    return this.specification.gameWorld ? this.specification.gameWorld : gameWorldTemplate;
  },
  gamePlayOrTemplate: function() {
    return this.specification.gamePlay ? this.specification.gamePlay : gamePlayTemplate;
  },
  singlePlayerGameOrTemplate: function() {
    return this.specification.singlePlayerGame ? this.specification.singlePlayerGame : singlePlayerGameTemplate;
  },
  multiPlayerGameOrTemplate: function() {
    return this.specification.multiPlayerGame ? this.specification.multiPlayerGame : multiPlayerGameTemplate;
  },
  extrasOrTemplate: function() {
    return this.specification.extras ? this.specification.extras : extrasTemplate;
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
    if (this.state === "public") {

    } else {
      this.changeAccess("public");
    }
    $("#successModal")
      .modal("show");
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
