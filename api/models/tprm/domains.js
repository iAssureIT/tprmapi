const mongoose = require('mongoose');

const domainsSchema = mongoose.Schema({
	_id			    : mongoose.Schema.Types.ObjectId,
    domain          : String,
    createdAt       : Date,
    createdBy       : { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
});

module.exports = mongoose.model('domains',domainsSchema);
