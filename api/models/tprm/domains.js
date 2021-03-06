const mongoose = require('mongoose');

const domainsSchema = mongoose.Schema({
	_id			    : mongoose.Schema.Types.ObjectId,
    domain          : String,
    createdAt       : Date,
    creatorRole     : String,
    company_ID      : { type: mongoose.Schema.Types.ObjectId, ref: 'companysettings' },
    createdBy       : { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
});

module.exports = mongoose.model('domains',domainsSchema);
