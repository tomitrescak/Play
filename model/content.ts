interface IContentFile {
  id: string;
  file: string;
  platform?: string;
}

interface IUserRating {
  owner: string;
  rating: number
}

interface ISpecification {
  overview?: string;
  featureSet?: number;
  gameWorld?: string;
  gamePlay?: string;
  singlePlayerGame?: string;
  multiPlayerGame?: string;
  extras?: string;
}

interface IContent {
  _id: string;
  title: string;
  description: string;
  genre: number;
  owner: string;
  ownerId: string;
  specification: ISpecification;
  createdOn: Date;
  modifiedOn: Date;
  screens: IContentFile[];
  images: IContentFile[];
  files: IContentFile[];
  rating: number;
  ratings: number;
  userRatings: IUserRating[];
  version: string;
  access: string;
  repository: string;
  initials: string;
  views: number;
  contentType: string;
  folder: string;
  webBuild: string;
}

declare var Contents: Mongo.Collection<IContent>;
Contents = new Mongo.Collection<IContent>("contents", {
  transform: (doc: IContent) => { return new Content(doc) }
});

/**
 * @class Content
 */
class Content {
  private _doc: IContent;
  private _id: string;
  title: string;
  description: string;
  genre: number;
  private _owner: string;
  private _ownerId: string;
  private _createdOn: Date;
  private _modifiedOn: Date;
  private _images: IContentFile[];
  private _screens: IContentFile[];
  private _files: IContentFile[];
  private _rating: number;
  private _ratings: number;
  private _userRatings: IUserRating[];
  private _version: string;
  private _access: string;
  repository: string;
  private _initials: string;
  private _views: number;
  private _contentType: string;
  private _folder: string;
  specification: ISpecification;
  webBuild: string;

  /**
   * @param {{title:string, description:string}} doc
   */
  constructor(doc: IContent) {

    if (doc) {
      this._doc = doc;
      this._id = doc._id;
      this.title = doc.title;
      this.description = doc.description;
      this.genre = doc.genre;
      this._owner = doc.owner;
      this._ownerId = doc.ownerId;
      this._createdOn = doc.createdOn;
      this._modifiedOn = doc.modifiedOn;
      this._images = doc.images;
      this._screens = doc.screens;
      this._files = doc.files;
      this._rating = doc.rating;
      this._ratings = doc.ratings;
      this._userRatings = doc.userRatings;
      this._version = doc.version;
      this._access = doc.access;
      this.repository = doc.repository;
      this._initials = doc.initials;
      this._views = doc.views;
      this._contentType = doc.contentType;
      this._folder = doc.folder;
      this.specification = doc.specification ? doc.specification : {};
      this.webBuild = doc.webBuild;
    } else {
      this.specification = {};
    }

  }

  /**
   * @property id
   * @returns {string}
   */
  get id() {return this._id }

  /**
   * Returns url friendly version of the url where non alphanumeric characters are replaced by hyphens
   * @property title
   * @param {string} title
   * @returns {string}
   */
  get urlTitle() {
    var title = this.title.replace(/[^a-zA-Z0-9]/g, '-');
    while (title.indexOf('--') >= 0) {
      title = title.replace(/--/g, '-');
    }
    return title;
  }

  /**
   * @property id
   * @returns {number}
   */
  get views() {return this._views }

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
   * @property screens
   * @returns {Array.<string>}
   */
  get images() { return this._images }

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
    if (!this.createdOn) {
      return "";
    }

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

  contentUploaded (contentType: string, file: string) {
    if (contentType === 'image') {
      Contents.update(this.id, {$push: {images: { id: new Mongo.ObjectID()._str, file: file }}});
    }
    else if (contentType === 'screenshot') {
      Contents.update(this.id, {$push: {screens: { id: new Mongo.ObjectID()._str, file: file }}});
    }
    else {
      Contents.update(this.id, { $pull: { files: { platform: contentType } }});
      Contents.update(this.id, { $push: { files: { id: new Mongo.ObjectID()._str, platform: contentType, file: file }}})
    }
  }

  changeAccess(access: string) {
    Contents.update(this.id, {$set: { access: access }});
  }

  rate(userRating: number) {
    if (userRating == 0) {
      return;
    }

    if (_.any(this._userRatings, (rating: IUserRating) => rating.owner == Meteor.userId() && rating.rating == userRating)) {
      return;
    }

    Meteor.call('rate', this.id, userRating, function(err: Meteor.Error, result: any) {
      if (err) {
        alert(err);
      }
    });
  }

  review(text: string) {
    Meteor.call('review', this.id, this._version, text, function(err: Meteor.Error, result: any) {
      if (err) {
        alert(err);
      }
    });
  }

  viewed(){
    Meteor.call('viewed', this.id);
  }

  serverRate(rating: number) {
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

  save(callback: Function) {
    if (!this.title) {
        throw "Title must be specified!";
    }

    this._modifiedOn = new Date();

    var dbData = {
      title: this.title,
      description: this.description,
      genre: this.genre,
      repository: this.repository,
      specification: this.specification
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
      dbData['screens'] = this._screens;
      dbData['version'] = this._version;
      dbData['contentType'] = this._contentType;
      dbData['folder'] = this._folder;
      dbData['initials'] = Meteor.user().profile.initials;
      dbData['views'] = 0;

      this._id = Contents.insert(dbData, function(err: Meteor.Error, result: any) {
        if (err) {
          alert(err);
        } else {
          callback();
        }
      });
    } else {
      dbData['modifiedOn'] = new Date();
      Contents.update({_id: this.id }, {$set: dbData});
    }
  }
}

// export
this.Content = Content;

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
    insert : (userId: string, doc: IContent) => { return userId === doc.ownerId },
    update : (userId: string, doc: IContent) => { return userId === doc.ownerId },
    remove : (userId: string, doc: IContent) => { return userId === doc.ownerId }
  });
}
