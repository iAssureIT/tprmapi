const mongoose = require('mongoose');

const frequencysSchema = mongoose.Schema({
	_id			            : mongoose.Schema.Types.ObjectId,
    frequency               : String,
    company_ID              : { type: mongoose.Schema.Types.ObjectId, ref: 'companysettings' },
    createdBy               : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt               : Date,
});

module.exports = mongoose.model('frequencys',frequencysSchema);
