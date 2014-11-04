export var tomi = 1;
export var Contents = new Mongo.Collection('contents', { transform: (doc) => { return new Content(doc)}});

/**
 * @class Content
 */
export class Content {
  /**
   * @param {{title:string, description:string}} doc
   */
  constructor(doc) {
    if (doc) {
      this._doc = doc;
      this._id = doc._id;
      this._title = doc.title;
      this._description = doc.description;
      this._genre = doc.genre;
      this._owner = doc.owner;
      this._ownerId = doc.ownerId;
      this._createdOn = doc.createdOn;
      this._modifiedOn = doc.modifiedOn;
      this._screens = doc.screens;
      this._files = doc.files;
      this._rating = doc.rating;
      this._ratings = doc.ratings;
      this._userRatings = doc.userRatings;
      this._version = doc.version;
      this._access = doc.access;
      this._repository = doc.repository;
      this._initials = doc.initials;

      this._contentType = doc.contentType;
      this._folder = doc.folder;
    }
    //else {
    //  this._owner = Meteor.user().profile.name;
    //  this._ownerId = Meteor.userId();
    //}
  }

  /**
   * @property id
   * @returns {string}
   */
  get id() {return this._id }

  /**
   * @property title
   * @returns {string}
   */
  get title() {return this._title }

  /**
   * @property title
   * @param {string} title
   * @returns {void}
   */
  set title(title) { this._title = title }

  /**
   * Returns url friendly version of the url where non alphanumeric characters are replaced by hyphens
   * @property title
   * @param {string} title
   * @returns {string}
   */
  get urlTitle() {
    var title = this._title.replace(/[^a-zA-Z0-9]/g, '-');
    while (title.indexOf('--') >= 0) {
      title = title.replace(/--/g, '-');
    }
    return title;
  }

  /**
   * @property description
   * @returns {*}
   */
  get description() { return this._description }

  /**
   * @property description
   * @returns {void}
   */
  set description(value) { this._description = value}

  /**
   * @property repository
   * @returns {string}
   */
  get repository() {return this._repository }

  /**
   * @property repository
   * @param {string} value
   * @returns {void}
   */
  set repository(value) { this._repository = value }

  /**
   * @property genre
   * @returns {string}
   */
  get genre() {return this._genre }

  /**
   * @property title
   * @param {string} value
   * @returns {void}
   */
  set genre(value) { this._genre = value }

  /**
   * @property owner
   * @returns {string}
   */
  get owner() { return this._owner }

  /**
   * @property ownerId
   * @returns {string}
   */
  get ownerId() { return this._ownerId }

  /**
   * @property createdOn
   * @returns {Date}
   */
  get createdOn() { return this._createdOn }

  /**
   * @property modifiedOn
   * @returns {Date}
   */
  get modifiedOn() { return this._modifiedOn }

  /**
   * @property screens
   * @returns {Array.<string>}
   */
  get screens() { return this._screens }

  /**
   * @property files
   * @returns {Array.<Object.<string, string>>}
   */
  get files() { return this._files }

  /**
   * @property rating
   * @returns {number}
   */
  get rating() { return this._rating }

  /**
   * @property ratings
   * @returns {number}
   */
  get ratings() { return this._ratings }

  /**
   * @property version
   * @returns {{identifier:string, info:string}}
   */
  get version() { return this._version }

  /**
   * @property access
   * @returns {string}
   */
  get access() { return this._access }

  get contentType() {
    return this._contentType.replace(/[^a-zA-Z0-9]/g, '-');
  }

  set contentType(value) {
    this._contentType = value;
  }

  get initials() {
    //if (this._initials) {
    //  return this._initials;
    //}
    //var ini = this.owner.split(' ');
    //this._initials = (ini[0].substring(0,2) + ini[1].substring(0,2)).toLowerCase();
    return this._initials;
  }

  get folderName() {
    return this._folder.replace(/[^a-zA-Z0-9]/g, '-');
  }

  get folder() {
    var date = this.createdOn;
    return date.getFullYear() + "/" +
      date.getMonth() + "/" +
      date.getDate() + "/" +
      this.contentType + "/" +
      this.initials + "/" +
      this.folderName + "-" +
      this.ownerId;
  }

  get averageRoundedRating() {
    return Math.round(this.averageRating);
  }

  get averageRating() {
    if (this._ratings === 0) return 0;

    return this._rating / this._ratings;
  }

  contentUploaded (contentType, contentPlatform, file, folder) {
    if (contentPlatform === 'screenshot') {
      Contents.update(this.id, {$push: {screens: { file: file }}});
    }
    else {
      Contents.update(this.id, { $pull: { files: { platform: contentPlatform } }});
      Contents.update(this.id, { $push: { files: { platform: contentPlatform, file: file }}})
    }
  }

  changeAccess(access) {
    Contents.update(this.id, {$set: { access: access }});
  }

  rate(rating) {
    Meteor.call('rate', this.id, rating, function(err, ok) {
      if (err) {
        alert(err);
      }
    });
  }

  review(text) {
    Meteor.call('review', this.id, this._version, text, function(err, ok) {
      if (err) {
        alert(err);
      }
    });
  }

  serverRate(rating) {
    if (Meteor.isServer) {
      if (this._userRatings == null) {
        this._userRatings = [];
      }
      // find actual rating
      var currentRating = _.findWhere(this._userRatings, {owner: Meteor.userId()});

      // if we rated the same we do nothing
      if (currentRating != null && rating === currentRating.rating) return;

      var ratings = this.ratings;
      var globalRating = this.rating;

      // remove previous rating
      if (currentRating != null) {
        Contents.update(this.id, {$pull: {userRatings: {owner: Meteor.userId()}}});
        globalRating -= currentRating.rating;
      } else {
        ratings++;
      }
      globalRating += rating;

      // update database
      Contents.update(this.id, {
        $set: {rating: globalRating, ratings: ratings},
        $push: {userRatings: {owner: Meteor.userId(), rating: rating}}
      });
    }
  }

  save() {
    this._modifiedOn = new Date();

    var dbData = {
      title: this._title,
      description: this._description,
      genre: this._genre,
      repository: this._repository
    };

    if (!this.id) {
      this._createdOn = new Date();
      this._owner = Meteor.user().profile.name;
      this._ownerId = Meteor.userId();
      this._rating = 0;
      this._files = [];
      this._screens = [];
      this._folder = this.urlTitle;


      // add records also to db
      dbData['createdOn'] = this._createdOn;
      dbData['owner'] = this._owner;
      dbData['ownerId'] = this._ownerId;
      dbData['rating'] = this._rating;
      dbData['ratings'] = 0;
      dbData['userRatings'] = [];
      dbData['files'] = this._files;
      dbData['files'] = this._files;
      dbData['screens'] = this._screens;
      dbData['version'] = this._version;
      dbData['contentType'] = this._contentType;
      dbData['folder'] = this._folder;
      dbData['initials'] = Meteor.user().profile.initials;

      this._id = Contents.insert(dbData, function(err, result) {
        if (err) {
          alert(err);
        }
      });
    } else {
      dbData['modifiedOn'] = new Date();
      Contents.update({_id: this.id }, {$set: dbData});
    }
  }
}

// TODO: Schema
//// Schema
//var schema = new SimpleSchema({
//  owner: {
//    type: String,
//    label: T9n.get('owner')
//  },
//  ownerId: {
//    type: String
//  },
//  title: {
//    type: String,
//    label: T9n.get('title')
//  },
//  description: {
//    type: String,
//    label: T9n.get('description')
//  },
//  screenShots: {
//    type: [Object]
//
//  }
//});

//Content.attachSchema(schema);

// Collection2 already does schema checking
// Add custom permission rules if needed
if (Meteor.isServer) {
  Contents.allow({
    /**
     * @param {String} userId
     * @param {{ownerId:String}} doc
     */
    insert : (userId, doc) => { return userId === doc.ownerId },
    update : (userId, doc) => { return userId === doc.ownerId },
    remove : (userId, doc) => { return userId === doc.ownerId }
  });
}
