const mongoose = require('mongoose');

const actionprioritySchema = mongoose.Schema({
	_id			            : mongoose.Schema.Types.ObjectId,
    actionpriority          : String,
    company_ID              : { type: mongoose.Schema.Types.ObjectId, ref: 'companysettings' },
    createdBy               : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt               : Date,
});

module.exports = mongoose.model('actionpriority',actionprioritySchema);
