const mongoose = require('mongoose');

const frameworktypesSchema = mongoose.Schema({
	_id			    : mongoose.Schema.Types.ObjectId,
    frameworktype   : String,
    createdAt       : Date,
    creatorRole     : String,
    company_ID      : { type: mongoose.Schema.Types.ObjectId, ref: 'companysettings' },
    createdBy       : { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
});

module.exports = mongoose.model('frameworktypes',frameworktypesSchema);
