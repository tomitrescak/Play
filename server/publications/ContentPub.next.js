Meteor.publish('content', () => {
  return Contents.find()
});

Meteor.publish('channelData', (id) => {
  return Contents.find({ownerId: id})
});

Meteor.publish('games', () => {
  return Contents.find({contentType: 'game', access: 'public'}, {sort: {rating: -1}});
});

Meteor.publish('game', (id) => {
  return Contents.find({_id: id});
});

Meteor.publish('singleContent', (id) => {
  return Contents.find({_id: id})
});

Meteor.methods({
  deleteFile: function(contentId, fileName) {
    var content = Contents.findOne({_id: contentId});
    var safeFileName = makeSafeFileName(fileName);

    var fs = Npm.require('fs');
    fs.unlinkSync(Meteor.uploadDirectory + content.folder + '/' + safeFileName);

    // delete from database
    Contents.update({_id: contentId}, {$pull: { files: { file : fileName}}})
  },
  deleteScreenshot: function(contentId, fileName) {
    var fs = Npm.require('fs');

    var content = Contents.findOne({_id: contentId});
    var safeFileName = makeSafeFileName(fileName);
    var filePath = Meteor.uploadDirectory + content.folder + '/' + safeFileName;

    fs.unlinkSync(filePath);
    fs.unlinkSync(Meteor.uploadDirectory + content.folder + '/thumbnail/' + safeFileName);

    // delete from database
    Contents.update({_id: contentId}, {$pull: { screens: { file : fileName}}})
  }
})
