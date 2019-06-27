const mongoose = require('mongoose');

const frameworktypesSchema = mongoose.Schema({
	_id			    : mongoose.Schema.Types.ObjectId,
    frameworktype   : String,
    createdAt       : Date,
    createdBy       : { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
});

module.exports = mongoose.model('frameworktypes',frameworktypesSchema);
