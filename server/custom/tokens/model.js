var mongoose = require('mongoose');

var TokensSchema = new mongoose.Schema({
    health: { type: String },
    mana: { type: String },
    stamina: { type: String },
    companyID: { type: String },
    owner: { type: String },
    nd_trash_deleted: { type: Boolean },
}, { collection: 'wst_Tokens'});

var Tokens = connection.model('Token', TokensSchema);
module.exports = Tokens;
