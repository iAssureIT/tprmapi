const mongoose = require('mongoose');

const nccriticalitySchema = mongoose.Schema({
	_id			            : mongoose.Schema.Types.ObjectId,
    nccriticality           : String,
    company_ID              : { type: mongoose.Schema.Types.ObjectId, ref: 'companysettings' },
    createdBy               : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt               : Date,
});

module.exports = mongoose.model('nccriticality',nccriticalitySchema);
