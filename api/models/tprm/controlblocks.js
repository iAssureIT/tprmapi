const mongoose = require('mongoose');

const controlblocksSchema = mongoose.Schema({
	_id			            : mongoose.Schema.Types.ObjectId,
    controlBlocksCode       : String,
    controlBlockRef         : Number,
    controlBlockName        : String,
    controlBlockDesc        : String,
    parentBlock             : Number,
    domain_ID               : { type: mongoose.Schema.Types.ObjectId, ref: 'domains' },
    sequence                : Number,
    weightage               : Number,
    company_ID              : { type: mongoose.Schema.Types.ObjectId, ref: 'companysettings' },
    createdBy               : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt               : Date,
    subControlBlocks           : [
                                {
                                   controlBlocks_ID :  { type: mongoose.Schema.Types.ObjectId, ref: 'controlblocks' }
                                }
                            ],
    controls                : [
                                {
                                    control_ID      : { type: mongoose.Schema.Types.ObjectId, ref: 'controls' }
                                }
                            ]
});

module.exports = mongoose.model('controlblocks',controlblocksSchema);
