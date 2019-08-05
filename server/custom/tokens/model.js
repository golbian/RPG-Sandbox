var mongoose = require('mongoose');

var _id = mongoose.Types.ObjectId(_id);

var TokensSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true }, 
    attributes: {},
    health: { type: String },
    mana: { type: String },
    stamina: { type: String },
    nd_trash_deleted: { type: Boolean },
}, { collection: 'wst_Tokens'});

var Token = connection.model('Token', TokensSchema);
module.exports = Token;
