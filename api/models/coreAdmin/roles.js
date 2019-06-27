const mongoose = require('mongoose');

const roleSchema = mongoose.Schema({
	_id			: mongoose.Schema.Types.ObjectId,
    role        : String,
    createdAt   : Date,
    createdBy   : { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
});

module.exports = mongoose.model('roles',roleSchema);
