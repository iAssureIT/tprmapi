const mongoose = require('mongoose');

const customertypesSchema = mongoose.Schema({
	_id			    : mongoose.Schema.Types.ObjectId,
    customertype    : String,
    createdAt       : Date,
    createdBy       : { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
});

module.exports = mongoose.model('customertypes',customertypesSchema);
