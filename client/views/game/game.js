Template.gameLoader.onCreated(function() {
  var self = this;
  self.ready = new ReactiveVar();
  self.autorun(function() {
    var handle1 = PostSubs.subscribe("game", FlowRouter.getParam("_id"));
    var handle2 = PostSubs.subscribe("reviews", FlowRouter.getParam("_id"));
    self.ready.set(handle1.ready() && handle2.ready());
  });
});

Template.gameLoader.helpers({
  itemsReady: function() {
    return Template.instance().ready.get();
  },
  gameItem: function() {
    return Contents.findOne(FlowRouter.getParam("_id"));
  }
});


Template.game.events({
  "submit form": function(e) {
    e.preventDefault();
    this.review($("#review").val());
  },
  "click .imageLink": function() {
    $("#imageHolder").attr("src", "/upload/" + this.file);
    //$("#imageDescription").html(this.file);

    $("#imageModal")
      .modal({
        blurring: true
      })
      .modal("show");
  }
});

Template.game.helpers({
  reviews: function() {
    return Reviews.find();
  },
  icon: function() {
    if (this.screens && this.screens.length > 0) {
      return this.screens[0].file;
    }
  },
  niceTime: function() {
    return moment(this.reviewDate).fromNow();
  },
  roundedRating: function() {
    return Math.round(this.averageRating);
  }
})

Template.game.rendered = function() {
  var that = this;
  var isInteractive = this.data.ownerId !== Meteor.userId();

  this.data.viewed();

  $(".ui.rating")
    .rating({
      interactive: isInteractive,
      onRate: function(rating) {
        that.data.rate(rating);
      }
    });

  $(".ui.form")
    .form({
      inline: true,
      on: "blur",
      fields: {
        review: {
          identifier: "review",
          rules: [{
            type: "empty",
            prompt: T9n.get("fieldRequired")
          }]
        }
      }
    });

  $(".menu .item").tab();
}

Template.UnityPlayer.onCreated(function() {

});

Template.UnityPlayer.onRendered(function() {
  var self = this;
  // var unityObjectUrl = "http://webplayer.unity3d.com/download_webplayer-3.x/3.0/uo/UnityObject2.js";
  // if (document.location.protocol == "https:")
  //   unityObjectUrl = unityObjectUrl.replace("http://", "https://ssl-");
  // document.write('<script type="text\/javascript" src="' + unityObjectUrl + '"><\/script>');

  var unityObjectUrl = "http://webplayer.unity3d.com/download_webplayer-3.x/3.0/uo/UnityObject2.js";
  if (document.location.protocol == 'https:')
    unityObjectUrl = unityObjectUrl.replace("http://", "https://ssl-");

  var s = document.createElement("script");
  s.type = "text/javascript";
  s.src = unityObjectUrl;
  $("head").append(s);

  $.getScript(unityObjectUrl, function() {

    var config = {
      width: "100%",
      height: 600,
      params: {
        enableDebugging: "0"
      }

    };
    var u = new UnityObject2(config);

    jQuery(function() {

      var $missingScreen = jQuery("#unityPlayer").find(".missing");
      var $brokenScreen = jQuery("#unityPlayer").find(".broken");
      $missingScreen.hide();
      $brokenScreen.hide();

      u.observeProgress(function(progress) {
        switch (progress.pluginStatus) {
          case "broken":
            $brokenScreen.find("a").click(function(e) {
              e.stopPropagation();
              e.preventDefault();
              u.installPlugin();
              return false;
            });
            $brokenScreen.show();
            break;
          case "missing":
            $missingScreen.find("a").click(function(e) {
              e.stopPropagation();
              e.preventDefault();
              u.installPlugin();
              return false;
            });
            $missingScreen.show();
            break;
          case "installed":
            $missingScreen.remove();
            break;
          case "first":
            break;
        }
      });
      u.initPlugin(jQuery("#unityPlayer")[0], "/upload/" + self.data.webBuild);
    });

  });

});
