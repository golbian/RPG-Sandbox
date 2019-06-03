var mongoose = require('mongoose');

var Gamesv2Schema = new mongoose.Schema({
    companyID: { type: String, required: true },
    gameName: { type: String, required: true },
    gameDescription: { type: String },
    gameType: { type: String },
    html: { type: String },
    maps: [],
    items: [],
    backgroundColor: { type: String },
    backgroundImage: { type: String },
    properties: { type: Object },
    history: [],
    nd_trash_deleted: { type: Boolean },
    nd_trash_deleted_date: { type: Date },
    owner: { type: String },
    parentFolder: { type: String },
    isPublic: { type: Boolean },
    isShared: { type: Boolean },
    createdBy: { type: String },
    author: { type: String },
    createdOn: { type: Date }
}, { collection: 'wst_Gamesv2', collation: { locale: 'en', strength: 2 } });

Gamesv2Schema.methods.publish = async function () {
    this.isPublic = true;

    return this.save();
};

Gamesv2Schema.methods.unpublish = async function () {
    this.isPublic = false;

    return this.save();
};

Gamesv2Schema.methods.share = async function (folderId) {
    this.parentFolder = folderId;
    this.isShared = true;

    return this.save();
};

Gamesv2Schema.methods.unshare = async function () {
    this.parentFolder = undefined;
    this.isShared = false;

    return this.save();
};

var Gamesv2 = connection.model('Gamesv2', Gamesv2Schema);
module.exports = Gamesv2;
