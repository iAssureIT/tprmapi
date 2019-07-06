const mongoose = require('mongoose');

const assessmentModeSchema = mongoose.Schema({
	_id			            : mongoose.Schema.Types.ObjectId,
    assessmentMode          : String,
    company_ID              : { type: mongoose.Schema.Types.ObjectId, ref: 'companysettings' },
    createdBy               : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt               : Date,
});

module.exports = mongoose.model('assessmentMode',assessmentModeSchema);
