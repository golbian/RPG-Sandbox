var mongoose = require('mongoose');

var MapsSchema = new mongoose.Schema({
    companyID: { type: String },
    mapName: { type: String, required: true },
    mapDescription: { type: String },
    properties: { type: String },
    owner: { type: String },
    createdBy: { type: String },
    author: { type: String },
    createdOn: { type: Date },
    parentFolder: { type: String },
    isPublic: { type: Boolean },
    isShared: { type: Boolean },
    nd_trash_deleted: { type: Boolean },
    nd_trash_deleted_date: { type: Date },
}, { collection: 'wst_Maps', collation: { locale: 'en', strength: 2 } });

MapsSchema.methods.publish = async function () {
    this.isPublic = true;
    return this.save();
};

MapsSchema.methods.unpublish = async function () {
    this.isPublic = false;
    return this.save();
};

MapsSchema.methods.share = async function (folderId) {
    this.parentFolder = folderId;
    this.isShared = true;

    return this.save();
};

MapsSchema.methods.unshare = async function () {
    this.parentFolder = undefined;
    this.isShared = false;

    return this.save();
};

var Maps = mongoose.model('Maps', MapsSchema);
module.exports = Maps;
