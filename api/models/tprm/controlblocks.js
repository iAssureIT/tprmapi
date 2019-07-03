const mongoose = require('mongoose');

const controlblocksSchema = mongoose.Schema({
	_id			            : mongoose.Schema.Types.ObjectId,
    controlBlocksCode       : String,
    controlBlockRef         : String,
    controlBlockName        : String,
    controlBlockDesc        : String,
    parentControlBlock_ID   : { type: mongoose.Schema.Types.ObjectId, ref: 'controlblocks' },
    domain_ID               : { type: mongoose.Schema.Types.ObjectId, ref: 'domains' },
    sequence                : Number,
    weightage               : Number,
    company_ID              : { type: mongoose.Schema.Types.ObjectId, ref: 'companysettings' },
    createdBy               : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt               : Date,
    controlBlocks           : [
                                {
                                   controlBlocks_ID :  { type: mongoose.Schema.Types.ObjectId, ref: 'controlblocks' }
                                }
                            ],
    controls                : [
                                {
                                    control_ID      : String
                                }
                            ]
});

module.exports = mongoose.model('controlblocks',controlblocksSchema);
