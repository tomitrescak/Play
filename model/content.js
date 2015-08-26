Contents = new Mongo.Collection("contents", {
    transform: function (doc) { return new Content(doc); }
});
/**
 * @class Content
 */
var Content = (function () {
    /**
     * @param {{title:string, description:string}} doc
     */
    function Content(doc) {
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
        }
        else {
            this.specification = {};
        }
    }
    Object.defineProperty(Content.prototype, "id", {
        /**
         * @property id
         * @returns {string}
         */
        get: function () { return this._id; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Content.prototype, "urlTitle", {
        /**
         * Returns url friendly version of the url where non alphanumeric characters are replaced by hyphens
         * @property title
         * @param {string} title
         * @returns {string}
         */
        get: function () {
            var title = this.title.replace(/[^a-zA-Z0-9]/g, '-');
            while (title.indexOf('--') >= 0) {
                title = title.replace(/--/g, '-');
            }
            return title;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Content.prototype, "views", {
        /**
         * @property id
         * @returns {number}
         */
        get: function () { return this._views; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Content.prototype, "owner", {
        /**
         * @property owner
         * @returns {string}
         */
        get: function () { return this._owner; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Content.prototype, "ownerId", {
        /**
         * @property ownerId
         * @returns {string}
         */
        get: function () { return this._ownerId; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Content.prototype, "createdOn", {
        /**
         * @property createdOn
         * @returns {Date}
         */
        get: function () { return this._createdOn; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Content.prototype, "modifiedOn", {
        /**
         * @property modifiedOn
         * @returns {Date}
         */
        get: function () { return this._modifiedOn; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Content.prototype, "screens", {
        /**
         * @property screens
         * @returns {Array.<string>}
         */
        get: function () { return this._screens; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Content.prototype, "images", {
        /**
         * @property screens
         * @returns {Array.<string>}
         */
        get: function () { return this._images; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Content.prototype, "files", {
        /**
         * @property files
         * @returns {Array.<Object.<string, string>>}
         */
        get: function () { return this._files; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Content.prototype, "rating", {
        /**
         * @property rating
         * @returns {number}
         */
        get: function () { return this._rating; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Content.prototype, "ratings", {
        /**
         * @property ratings
         * @returns {number}
         */
        get: function () { return this._ratings; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Content.prototype, "version", {
        /**
         * @property version
         * @returns {{identifier:string, info:string}}
         */
        get: function () { return this._version; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Content.prototype, "access", {
        /**
         * @property access
         * @returns {string}
         */
        get: function () { return this._access; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Content.prototype, "contentType", {
        get: function () {
            return this._contentType.replace(/[^a-zA-Z0-9]/g, '-');
        },
        set: function (value) {
            this._contentType = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Content.prototype, "initials", {
        get: function () {
            //if (this._initials) {
            //  return this._initials;
            //}
            //var ini = this.owner.split(' ');
            //this._initials = (ini[0].substring(0,2) + ini[1].substring(0,2)).toLowerCase();
            return this._initials;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Content.prototype, "folderName", {
        get: function () {
            return this._folder.replace(/[^a-zA-Z0-9]/g, '-');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Content.prototype, "folder", {
        get: function () {
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Content.prototype, "averageRoundedRating", {
        get: function () {
            return Math.round(this.averageRating);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Content.prototype, "averageRating", {
        get: function () {
            if (this._ratings === 0)
                return 0;
            return this._rating / this._ratings;
        },
        enumerable: true,
        configurable: true
    });
    Content.prototype.contentUploaded = function (contentType, file) {
        if (contentType === 'image') {
            Contents.update(this.id, { $push: { images: { id: new Mongo.ObjectID()._str, file: file } } });
        }
        else if (contentType === 'screenshot') {
            Contents.update(this.id, { $push: { screens: { id: new Mongo.ObjectID()._str, file: file } } });
        }
        else {
            Contents.update(this.id, { $pull: { files: { platform: contentType } } });
            Contents.update(this.id, { $push: { files: { id: new Mongo.ObjectID()._str, platform: contentType, file: file } } });
        }
    };
    Content.prototype.changeAccess = function (access) {
        Contents.update(this.id, { $set: { access: access } });
    };
    Content.prototype.rate = function (userRating) {
        if (userRating == 0) {
            return;
        }
        if (_.any(this._userRatings, function (rating) { return rating.owner == Meteor.userId() && rating.rating == userRating; })) {
            return;
        }
        Meteor.call('rate', this.id, userRating, function (err, result) {
            if (err) {
                alert(err);
            }
        });
    };
    Content.prototype.review = function (text) {
        Meteor.call('review', this.id, this._version, text, function (err, result) {
            if (err) {
                alert(err);
            }
        });
    };
    Content.prototype.viewed = function () {
        Meteor.call('viewed', this.id);
    };
    Content.prototype.serverRate = function (rating) {
        if (Meteor.isServer) {
            if (this._userRatings == null) {
                this._userRatings = [];
            }
            // find actual rating
            var currentRating = _.findWhere(this._userRatings, { owner: Meteor.userId() });
            // if we rated the same we do nothing
            if (currentRating != null && rating === currentRating.rating)
                return;
            var ratings = this.ratings;
            var globalRating = this.rating;
            // remove previous rating
            if (currentRating != null) {
                Contents.update(this.id, { $pull: { userRatings: { owner: Meteor.userId() } } });
                globalRating -= currentRating.rating;
            }
            else {
                ratings++;
            }
            globalRating += rating;
            // update database
            Contents.update(this.id, {
                $set: { rating: globalRating, ratings: ratings },
                $push: { userRatings: { owner: Meteor.userId(), rating: rating } }
            });
        }
    };
    Content.prototype.save = function (callback) {
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
            this._id = Contents.insert(dbData, function (err, result) {
                if (err) {
                    alert(err);
                }
                else {
                    callback();
                }
            });
        }
        else {
            dbData['modifiedOn'] = new Date();
            Contents.update({ _id: this.id }, { $set: dbData });
        }
    };
    return Content;
})();
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
        insert: function (userId, doc) { return userId === doc.ownerId; },
        update: function (userId, doc) { return userId === doc.ownerId; },
        remove: function (userId, doc) { return userId === doc.ownerId; }
    });
}
