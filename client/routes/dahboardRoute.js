Router.map(function () {
  this.route('dashboard', {
    path :  '/dashboard'
  });

  this.route('uploadGame', {
    path :  '/game/upload',
    data: function() {
      return new Content();
    }
  });

  this.route('modifyGame', {
    path :  '/game/modify/:urlTitle/:_id',
    template: 'uploadGame',
    waitOn: function() {
      return Meteor.subscribe('singleContent', this.params._id)
    },
    data: function() {
      var content = Contents.findOne(this.params._id);
      // store this on document since storing this in session strips all the
      // functionality of functions and keeps only a bare object
      // TODO:Think of a better way of storing this
      document.app_content =  content;
      return content;
    }
  });

  this.route('channel', {
    path :  '/channel/user/public/:userId/',
    template: 'contentList',
    waitOn: function() {
      return Meteor.subscribe('channelData', this.params.userId);
    },
    data: function() {
      return {
        items: Contents.find({}, {sort: {rating: -1}}),
        title: "My Channel"
      }
    }
  });

  this.route('games', {
    path :  '/games',
    template: 'contentList',
    waitOn: function() {
      return Meteor.subscribe('games');
    },
    data: function() {
      return {
        items: Contents.find({}, {sort: {rating: -1}}),
        title: "Games"
      }
    }
  });

  this.route('game', {
    path :  '/game/:urlTitle/:id',
    template: 'game',
    waitOn: function() {
      return Meteor.subscribe('game', this.params.id);
    },
    data: function() {
      return Contents.findOne()
    }
  });

});