const mongoose = require('mongoose');

const masternotificationSchema = mongoose.Schema({
	_id			 : mongoose.Schema.Types.ObjectId,
    templateType : String,	
	templateName : String,
	subject      : String,
	content      : String,	
    createdAt    : Date,
});

module.exports = mongoose.model('masternotifications',masternotificationSchema);
