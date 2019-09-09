const mongoose = require('mongoose');

const frameworksSchema = mongoose.Schema({
	_id			        : mongoose.Schema.Types.ObjectId,
    frameworkID         : Number,
    frameworktype       : String,
    frameworkname       : String,
    purpose             : String,
    domain_ID           : { type: mongoose.Schema.Types.ObjectId, ref: 'domains' },
    company_ID          : { type: mongoose.Schema.Types.ObjectId, ref: 'companysettings' },
    createdBy           : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    ref_framework_ID    : { type: mongoose.Schema.Types.ObjectId, ref: 'frameworks' },
    state               : Boolean,
    stage               : Boolean,
    version             : Number,
    controlBlocks       : [
                                {
                                   controlBlocks_ID :  { type: mongoose.Schema.Types.ObjectId, ref: 'frameworks' }
                                }
                          ]
});

module.exports = mongoose.model('frameworks',frameworksSchema);
