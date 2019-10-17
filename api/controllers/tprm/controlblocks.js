const mongoose	= require("mongoose");
var ObjectID = require('mongodb').ObjectID;
var request     = require('request-promise');

const Controlblocks = require('../../models/tprm/controlblocks');
const Framwork      = require('../../models/tprm/frameworks');
const Control       = require('../../models/tprm/controls');

exports.create_controlblocks_framwork = (req,res,next)=>{
	Controlblocks.findOne({controlBlockName:req.body.controlBlockName})
		.exec()
		.then(data =>{
			if(data){
				return res.status(200).json({
					message: 'Control Block Name already exists'
				});
			}else{ 
                if(req.body.framework_ID){
    				const controlblocks = new Controlblocks({
                        _id                     : new mongoose.Types.ObjectId(), 
                        controlBlocksCode       : req.body.controlBlocksCode,
                        controlBlockRef         : req.body.controlBlockRef,
                        controlBlockName        : req.body.controlBlockName,
                        controlBlockDesc        : req.body.controlBlockDesc,
                        parentBlock             : req.body.parentBlock,
                        domain_ID               : req.body.domain_ID,
                        sequence                : req.body.sequence,
                        weightage               : req.body.weightage,
                        company_ID              : req.body.company_ID,
                        createdBy               : req.body.createdBy,
                        createdAt               : new Date(),
                    });
                    controlblocks.save()
                        .then(data=>{
                            if(data){
                                Framwork.update(
                                                    {_id : req.body.framework_ID},
                                                    {
                                                        $push : {
                                                            controlBlocks : {
                                                                controlBlocks_ID : data._id
                                                            }
                                                        }
                                                    }
                                                )
                                        .exec()
                                        .then(framework=>{
                                            if(framework.nModified == 1){
                                                res.status(200).json({message:"Control Block and Framework updated",ID:data._id})
                                            }
                                        })
                                        .catch(err =>{
                                            console.log(err);
                                            res.status(500).json({
                                                error: err
                                            });
                                        });
                            }else{
                                res.status(409).json({message: "Something went wrong"});
                            }
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
                }else{
                    res.status(200).json({message:"Framework Id is missing"});
                }
			}
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};

exports.create_controlblocks_subcontrolblock = (req,res,next)=>{
	Controlblocks.findOne({controlBlockName:req.body.controlBlockName})
		.exec()
		.then(data =>{
			if(data){
				return res.status(200).json({
					message: 'Control Block Name already exists' 
				});
			}else{
                if(req.body.controlblock_ID){
    				const controlblocks = new Controlblocks({
                        _id                     : new mongoose.Types.ObjectId(),
                        controlBlockRef         : req.body.controlBlockRef,
                        controlBlockName        : req.body.controlBlockName,
                        controlBlockDesc        : req.body.controlBlockDesc,
                        parentBlock             : req.body.parentBlock,
                        domain_ID               : req.body.domain_ID,
                        sequence                : req.body.sequence,
                        weightage               : req.body.weightage,
                        company_ID              : req.body.company_ID,
                        createdBy               : req.body.createdBy,
                        createdAt               : new Date(),
                    });
                    controlblocks.save()
                        .then(data=>{
                            if(data){
                                console.log('data ',data._id);
                                Controlblocks.updateOne(
                                                    {_id : req.body.controlblock_ID},
                                                    {
                                                        $push : {
                                                            subControlBlocks : {
                                                                controlBlocks_ID : data._id
                                                            }
                                                        }
                                                    }
                                                )
                                        .exec()
                                        .then(controlblock=>{
                                            // console.log("controlblock ",controlblock);
                                            if(controlblock.nModified == 1){
                                                res.status(200).json({message:"New Control Block created and Parent Control Block updated",ID:data._id})
                                            }else{
                                                res.status(200).json({message:"New Control Block created and Parent Control Block not updated",ID:data._id})
                                            }
                                        })
                                        .catch(err =>{
                                            console.log(err);
                                            res.status(500).json({
                                                error: err
                                            });
                                        });
                            }else{
                                res.status(409).json({message: "Something went wrong"});
                            }
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
                    }else {
                        res.status(200).json("Controlblock ID is missing");
                    }
			}
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};

exports.list_controlblocks = (req,res,next)=>{
    Controlblocks.find()
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{ 
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.list_controlblocks_company = (req,res,next)=>{
    var company_ID = req.params.company_ID;
    Controlblocks.find({company_ID : company_ID})
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.list_controlblocks_company_except_ref = (req,res,next)=>{
    var company_ID = req.params.company_ID;
    Controlblocks.find({company_ID : company_ID, ref_contolBlock_ID : { $exists : false }})
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.detail_controlblocks = (req,res,next)=>{
    Controlblocks.findOne({_id:req.params.controlBlock_ID})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json({message:'Control block not found'});
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_basic_controlblocks = (req,res,next)=>{
    var controlBlockNameData = req.body.controlBlockName;
    Controlblocks.findOne({controlBlockName:req.body.controlBlockName})
            		.exec()
            		.then(data =>{
            			if(data && data._id !== req.body.id){
            				return res.status(200).json({
            					message: 'Control Block Name already exists'
            				});
            			}else{
            				Controlblocks.updateOne(
                                { _id:req.body.id},  
                                {
                                    $set:{
                                        'controlBlockRef'         : req.body.controlBlockRef,
                                        'controlBlockName'        : req.body.controlBlockName,
                                        'controlBlockDesc'        : req.body.controlBlockDesc,
                                        'parentBlock'             : req.body.parentBlock,
                                        'domain_ID'               : req.body.domain_ID,
                                        'sequence'                : req.body.sequence,
                                        'weightage'               : req.body.weightage,
                                        // 'company_ID'              : req.body.company_ID,
                                    }
                                }
                            )
                            .exec()
                            .then(data=>{
                                if(data.nModified == 1){
                                    res.status(200).json("Control Block Updated");
                                }else{
                                    res.status(401).json("Something went wrong");
                                }
                            })
                            .catch(err =>{
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
            			}
            		})
            		.catch(err =>{
            			console.log(err);
            			res.status(500).json({
            				error: err
            			});
                    });
}

exports.update_controlblock = (req,res,next)=>{
    // console.log('controlblock params ',req.params);
    switch(req.params.action){
        case 'add'      :
            Controlblocks.updateOne(
                { _id : req.params.controlBlocks_ID},  
                {
                    $push:{
                        subControlBlocks : {
                            controlBlocks_ID        : req.body.subcontrolBlocks_ID,
                        }
                    }
                }
            )
            .exec()
            .then(data=>{
                if(data.nModified == 1){
                    res.status(200).json("Control Block added");
                }else{
                    res.status(401).json("Something went wrong");
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });  
            break;
        case 'remove'    :
            Controlblocks.updateOne(
                { _id : req.params.controlBlocks_ID},  
                {
                    $pull:{
                        subControlBlocks : {
                            controlBlocks_ID        : req.body.subcontrolBlocks_ID,
                        }
                    }
                }
            )
            .exec()
            .then(data=>{
                if(data.nModified == 1){
                    res.status(200).json("Control Block removed");
                }else{
                    res.status(401).json("Something went wrong");
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            }); 
            break;
        default         :
            res.status(409).json("Action parameter mismatch");
    }
}

exports.update_control = (req,res,next)=>{
    switch(req.params.action){
        case 'add'      :
            Controlblocks.updateOne(
                { _id : req.params.controlBlocks_ID},  
                {
                    $push:{
                        controls : {
                            control_ID        : req.body.control_ID,
                        }
                    }
                }
            )
            .exec()
            .then(data=>{
                if(data.nModified == 1){
                    res.status(200).json("Control added");
                }else{
                    res.status(401).json("Something went wrong");
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });  
            break;
        case 'remove'    :
            Controlblocks.updateOne(
                { _id : req.params.controlBlocks_ID},  
                {
                    $pull:{
                        controls : {
                            control_ID        : req.body.control_ID,
                        }
                    }
                }
            )
            .exec()
            .then(data=>{
                if(data.nModified == 1){
                    res.status(200).json("Control removed");
                }else{
                    res.status(401).json("Something went wrong");
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            }); 
            break;
        default         :
            res.status(409).json("Action parameter mismatch");
    }
}

exports.delete_controlblocks = (req,res,next)=>{
    Controlblocks.deleteOne({_id:req.params.controlBlock_ID})
        .exec()
        .then(data=>{
            if(data.deletedCount == 1){
                res.status(200).json("Control Block deleted");
            }else{
                res.status(200).json("Control Block not Found");
            }
            
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.delete_all_controlblocks = (req,res,next)=>{
    Controlblocks.deleteMany({})
        .exec()
        .then(data=>{
            if(data.deletedCount > 0){
                res.status(200).json("All Control Block deleted");
            }else{
                res.status(200).json("Something went wrong");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            }); 
        });
}
exports.controlblocks_count_of_count = (req,res,next)=>{
    Controlblocks.countDocuments({company_ID :{$in :[req.params.company_ID,req.params.user_ID ]}, ref_contolBlock_ID : { $exists : false } })
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json({message:'Control block not found'});
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
exports.controlblockscount_for_admin = (req,res,next)=>{
    Controlblocks.countDocuments({company_ID :{$in : req.body.ids}, ref_contolBlock_ID : { $exists : false } })
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json({message:'Control block not found'});
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
exports.controlblocks_count_of_comapanyUser = (req,res,next)=>{
    Controlblocks.countDocuments({company_ID :{$in :[req.params.company_ID,req.params.user_ID,req.params.riskpro_ID ]},ref_contolBlock_ID : { $exists : false } })
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json({message:'Control block not found'});
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
exports.controlblocks_of_forall = (req,res,next)=>{
    Controlblocks.find({company_ID :{$in : req.body.ids},ref_contolBlock_ID : { $exists : false } })
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json({message:'Control block not found'});
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
exports.controlblocks_count_of_admin = (req,res,next)=>{
    Controlblocks.countDocuments({company_ID :req.params.user_ID })
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json({message:'Control block not found'});
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
exports.fetch_all_subcontrolblocks = (req,res,next)=>{
    processCBArray(req.body.lstcontrolblocks);
    async function processCBArray(cbs){
        console.log("cbs",cbs);
        var outputArray = []; 
        for ( i = cbs.length-1; i >= 0; i--) {
            var newArray = await findCB(cbs[i]);
            if(newArray.length > 0){
                outputArray = outputArray.concat(newArray);
            }
        } 
        res.header("Access-Control-Allow-Origin","*");
        res.status(200).json(outputArray);
    }
    function findCB(inputCB){
        return new Promise(function(resolve,reject){
            Controlblocks   .findOne({ _id : new ObjectID(inputCB.controlBlocks_ID) })
                            .exec()
                            .then(data=>{
                                if(data){
                                    resolve(data.subControlBlocks); 
                                }else{
                                    resolve([]);
                                }
                            })
                            .catch(err =>{
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
        });
    }
}
exports.fetch_all_controlblocks = (req,res,next)=>{
    processCBArray(req.body.lstcontrolblocks);
    async function processCBArray(cbs){
        var outputArray = []; 
        for ( i = cbs.length-1; i >= 0; i--) {
            var newArray = await findCB(cbs[i].controlBlocks_ID);
            if(newArray){
                outputArray = outputArray.concat(newArray);
            }
        } 
        res.header("Access-Control-Allow-Origin","*");
        res.status(200).json(outputArray);
    }
    function findCB(controlBlocks_ID){
        return new Promise(function(resolve,reject){
            Controlblocks   .findOne({ _id : controlBlocks_ID })
                            .exec()
                            .then(data=>{
                                if(data){
                                    console.log("data",data);
                                    resolve(data); 
                                }else{
                                    resolve([]);
                                }
                            })
                            .catch(err =>{
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
        });
    }
}

exports.fetch_all_controls = (req,res,next)=>{
    processControlArray(req.body.lstcontrolblocks);
    async function processControlArray(controlblocks){
        var outputArray = [];
        for ( i = controlblocks.length-1; i >= 0; i--) {
            var newArray = await findControls(controlblocks[i]);
            if(newArray.length > 0){
                outputArray = outputArray.concat(newArray);
            }
        }
        res.header("Access-Control-Allow-Origin","*");
        res.status(200).json(outputArray);
    }
    function findControls(inputCB){
        return new Promise(function(resolve,reject){
            Controlblocks   .aggregate([
                                            {
                                                $match : { _id : new ObjectID(inputCB.controlBlocks_ID) }
                                            },
                                            {
                                                $project : {"controlBlock_ID" : "$_id","control_ID":"$controls","_id":0}
                                            },
                                            {
                                                $unwind : "$control_ID"
                                            },
                                            {
                                                $project : {"controlBlock_ID":1,"control_ID" : "$control_ID.control_ID"}
                                            }
                                        ])
                            .exec()
                            .then(data=>{
                                resolve(data); 
                            })
                            .catch(err =>{
                                // console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
        });
    }
}

exports.fetch_specific_domain = (req,res,next)=>{
    Controlblocks.find({domain_ID : req.params.domain_ID})
                .exec()
                .then(data=>{
                    res.status(200).json(data);
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
}

exports.fetch_subcb_control_details = (req,res,next)=>{
    Controlblocks   .aggregate([
                            {
                                $match : {_id : new ObjectID(req.params.controlBlock_ID)}
                            },
                            {
                                $lookup : {
                                        from            : "controlblocks",
                                        localField      : "subControlBlocks.controlBlocks_ID",
                                        foreignField    : "_id",
                                        as              : "controlBlock"
                                }
                            },
                            {
                                $lookup : {
                                        from            : "controls",
                                        localField      : "controls.control_ID",
                                        foreignField    : "_id",
                                        as              : "control"
                                }
                            },
                            {
                                $unwind : "$subControlBlocks"
                            },
                            {
                                $unwind : "$controlBlock"
                            },
                            {
                                $unwind : "$controls"
                            },
                            {
                                $unwind : "$control"
                            },
                            {
                                $redact: {
                                    $cond: [
                                            {
                                                $eq: [
                                                       "$subControlBlocks.controlBlocks_ID",
                                                        "$controlBlock._id"
                                                    ]
                                            },
                                          "$$KEEP",
                                          "$$PRUNE"
                                        ]
                                }
                            },
                            {
                                $redact: {
                                    $cond: [
                                            {
                                                $eq: [
                                                       "$controls.control_ID",
                                                        "$control._id"
                                                    ]
                                            },
                                          "$$KEEP",
                                          "$$PRUNE"
                                        ]
                                }
                            },
                            {
                                $project : {
                                    "_id"               : 1,
                                    "controlBlocksCode" : 1,
                                    "controlBlockRef"   : 1,
                                    "controlBlockName"  : 1,
                                    "controlBlockDesc"  : 1,
                                    "parentBlock"       : 1,
                                    "domain_ID"         : 1,
                                    "sequence"          : 1,
                                    "weightage"         : 1,
                                    "company_ID"        : 1,
                                    "createdBy"         : 1,
                                    "createdAt"         : 1,
                                    "subControlBlocks1"  : {
                                                            "_id"               : "$subControlBlocks._id",
                                                            "controlBlocks_ID"  : "$subControlBlocks.controlBlocks_ID",
                                                            "controlBlockRef"   : "$controlBlock.controlBlockRef",
                                                            "controlBlockName"  : "$controlBlock.controlBlockName",
                                                            "controlBlockDesc"  : "$controlBlock.controlBlockDesc",
                                                            "parentBlock"       : "$controlBlock.parentBlock",
                                                            "domain_ID"         : "$controlBlock.domain_ID",
                                                            "sequence"          : "$controlBlock.sequence",
                                                            "weightage"         : "$controlBlock.weightage",
                                                            "company_ID"        : "$controlBlock.company_ID",
                                                            "createdBy"         : "$controlBlock.createdBy",
                                                            "createdAt"         : "$controlBlock.createdAt",
                                                            "subControlBlocks"  : "$controlBlock.subControlBlocks",
                                                            "controls"          : "$controlBlock.controls",
                                                        },
                                    "controls1"          : {
                                                            "_id"               : "$controls._id",
                                                            "control_ID"        : "$controls.control_ID",
                                                            "controlShort"      : "$control.controlShort",
                                                            "controlDesc"       : "$control.controlDesc",
                                                            "controltag_ID"     : "$control.controltag_ID",
                                                            "ref1"              : "$control.ref1",
                                                            "ref2"              : "$control.ref2",
                                                            "ref3"              : "$control.ref3",
                                                            "risk"              : "$control.risk",
                                                            "multiplier"        : "$control.multiplier",
                                                            "mandatory"         : "$control.mandatory",
                                                            "scored"            : "$control.scored",
                                                            "controlBlocks_ID"  : "$control.controlBlocks_ID",
                                                            "company_ID"        : "$control.company_ID",
                                                            "createdBy"         : "$control.createdBy",
                                                            "createdAt"         : "$control.createdAt"
                                                        }
                                }
                            },
                            {
                                $group : {
                                    _id : {
                                        "_id"               : "$_id",
                                        "controlBlocksCode" : "$controlBlocksCode",
                                        "controlBlockRef"   : "$controlBlockRef",
                                        "controlBlockName"  : "$controlBlockName",
                                        "controlBlockDesc"  : "$controlBlockDesc",
                                        "parentBlock"       : "$parentBlock",
                                        "domain_ID"         : "$domain_ID",
                                        "sequence"          : "$sequence",
                                        "weightage"         : "$weightage",
                                        "company_ID"        : "$company_ID",
                                        "createdBy"         : "$createdBy",
                                        "createdAt"         : "$createdAt",
                                    },
                                    "subControlBlocks"      : {"$push" : "$subControlBlocks1"},
                                    "controls"              : {"$push" : "$controls1"},
                                }
                            },
                            {
                                $project : {
                                    "_id"               : "$_id._id",
                                    "controlBlocksCode" : "$_id.controlBlocksCode",
                                    "controlBlockRef"   : "$_id.controlBlockRef",
                                    "controlBlockName"  : "$_id.controlBlockName",
                                    "controlBlockDesc"  : "$_id.controlBlockDesc",
                                    "parentBlock"       : "$_id.parentBlock",
                                    "domain_ID"         : "$_id.domain_ID",
                                    "sequence"          : "$_id.sequence",
                                    "weightage"         : "$_id.weightage",
                                    "company_ID"        : "$_id.company_ID",
                                    "createdBy"         : "$_id.createdBy",
                                    "createdAt"         : "$_id.createdAt",
                                    "subControlBlocks"  : { "$setUnion": [ "$subControlBlocks", "$subControlBlocks" ] },
                                    "controls"          : { "$setUnion": [ "$controls", "$controls" ] },

                                }
                            }
                        ])
                    .exec()
                    .then(data=>{
                        console.log("data",data);
                        res.status(200).json(data)
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });   
}



