const mongoose = require('mongoose');

const riskfactorsSchema = mongoose.Schema({
	_id			    : mongoose.Schema.Types.ObjectId,
    riskfactor      : String,
    createdAt       : Date,
    createdBy       : { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
});

module.exports = mongoose.model('riskfactors',riskfactorsSchema);
