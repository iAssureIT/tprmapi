const mongoose = require('mongoose');

const controlsSchema = mongoose.Schema({
	_id			            : mongoose.Schema.Types.ObjectId,
    // controlBlocks_ID        : { type: mongoose.Schema.Types.ObjectId, ref: 'controlblocks' },
    controlShort            : String,
    controlDesc             : String,
    controltag_ID           : { type: mongoose.Schema.Types.ObjectId, ref: 'controltag' },
    ref1                    : String,
    ref2                    : String,
    ref3                    : String,
    risk                    : String,
    multiplier              : Number,
    mandatory               : Boolean,
    scored                  : Boolean,
    company_ID              : { type: mongoose.Schema.Types.ObjectId, ref: 'companysettings' },
    createdBy               : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt               : Date,
});

module.exports = mongoose.model('controls',controlsSchema);
