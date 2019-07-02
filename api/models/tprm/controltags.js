const mongoose = require('mongoose');

const controltagsSchema = mongoose.Schema({
	_id			    : mongoose.Schema.Types.ObjectId,
    controltag      : String,
    createdAt       : Date,
    creatorRole     : String,
    corporate_ID    : { type: mongoose.Schema.Types.ObjectId, ref: 'companysettings' },
    createdBy       : { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
});

module.exports = mongoose.model('controltags',controltagsSchema);
