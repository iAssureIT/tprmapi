const mongoose = require('mongoose');

const masternotificationSchema = mongoose.Schema({
	_id			 : mongoose.Schema.Types.ObjectId,
    templateType : String,	
	templateName : String,
	subject      : String,
	content      : String,	
	createdAt    : Date,
	createdBy	 : { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
});

module.exports = mongoose.model('masternotifications',masternotificationSchema);
