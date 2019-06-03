var mongoose = require('mongoose');

var RolesSchema = new mongoose.Schema({
    companyID: { type: String, required: false },
    name: { type: String, required: true },
    description: { type: String },
    permissions: [],
    grants: [],
    gamesCreate: { type: Boolean },
    pagesCreate: { type: Boolean },
    gamesShare: { type: Boolean },
    mapsCreate: { type: Boolean },
    exploreData: { type: Boolean },
    viewSQL: { type: Boolean },
    mapsShare: { type: Boolean },
    nd_trash_deleted: { type: Boolean },
    nd_trash_deleted_date: { type: Date },
    createdBy: { type: String },
    createdOn: { type: Date }
}, { collection: 'wst_Roles' });

var Roles = connection.model('Roles', RolesSchema);
module.exports = Roles;
