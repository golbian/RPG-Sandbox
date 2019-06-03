var mongoose = require('mongoose');

var GamesSchema = new mongoose.Schema({
    companyID: { type: String, required: true },
    gameName: { type: String, required: true },
    gameDescription: { type: String },
    gameType: { type: String },
    items: [],
    backgroundColor: { type: String },
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
}, { collection: 'wst_Games' });

var Games = connection.model('Games', GamesSchema);
module.exports = Games;
