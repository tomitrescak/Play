Template['uploadGamePanel'].events({
  'submit form': function(e) {
    e.preventDefault();

    // save the data to database
    this.title = $('#title').val();
    this.description = $('#description').val();
    this.genre = $('#genre').val();
    this.repository = $('#repository').val();
    this.contentType = 'game';

    this.save();

    // reroute
    Router.go('modifyGame', {urlTitle: this.urlTitle, _id: this.id });
  },
  'click #saveGame': function(e) {
    e.preventDefault();
    this.save();
  },
  'click #publishGame': function() {
    if (this.state === 'public') {

    }
    else {
      this.changeAccess('public');
    }
    $('#successModal')
      .modal('show');
  },
  'click .deleteScreenshot': function(e) {
    e.preventDefault();
    if (confirm('Do you really wish to delete this screenshot?')) {
      Meteor.call('deleteScreenshot',
        e.currentTarget.attributes['data-id'].value,
        this.file,
        function(err, ok) {
          if (err) {
            alert(err);
          }
        });
    }
  },
  'click .deleteFile': function(e) {
    e.preventDefault();
    if (confirm('Do you really wish to delete this file?')) {
      Meteor.call('deleteFile',
        e.currentTarget.attributes['data-id'].value,
        this.file, function(err, ok) {
          if (err) {
            alert(err);
          }
        });
    }
  }
});

Template['uploadGamePanel'].rendered = function() {
  $('.ui.form')
    .form({
      title: {
        identifier : 'fieldRequired',
        rules: [
          {
            type   : 'empty',
            prompt : T9n.get('required')
          }
        ]
      },
      genre: {
        identifier : 'fieldRequired',
        rules: [
          {
            type   : 'empty',
            prompt : T9n.get('required')
          }
        ]
      },
      description: {
        identifier : 'fieldRequired',
        rules: [
          {
            type   : 'empty',
            prompt : T9n.get('required')
          }
        ]
      }
    }, {
      inline : true,
      on     : 'blur'
    });

  $('.ui.dropdown').dropdown();
};
