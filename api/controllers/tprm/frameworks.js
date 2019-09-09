const mongoose	= require("mongoose");
var ObjectID = require('mongodb').ObjectID;
var request = require('request-promise');
const Framework         = require('../../models/tprm/frameworks');
const Controlblocks     = require('../../models/tprm/controlblocks');
const Control           = require('../../models/tprm/controls');

function duplicate_controlBlocks(controlBlock){
    var company_ID = controlBlock.company_ID;
    var createdBy = controlBlock.createdBy;
    var sequence = controlBlock.sequence;
    return new Promise(function(resolve,reject){
        Controlblocks.findOne({_id:controlBlock.controlBlocks_ID})
                .exec()
                .then(baseControlblock=>{
                    if(baseControlblock){
                        fetchNewSCB();
                        async function fetchNewSCB(){
                            var newSubCB = [];
                            var listSubControlBlocks = baseControlblock.subControlBlocks;
                            for(i = 0;i < listSubControlBlocks.length; i++){
                                    var newCB = await duplicate_controlBlocks({
                                                            controlBlocks_ID : listSubControlBlocks[i].controlBlocks_ID,
                                                            sequence         : sequence,
                                                            company_ID       : company_ID,
                                                            createdBy        : createdBy                       
                                                        });
                                    if(newCB == "Control Not found"){
                                        res.status(200).json({message:"Control Block Not Found"})
                                    }
                                    newSubCB.push({"controlBlocks_ID":newCB});
                            }
                            if(i >= listSubControlBlocks.length){
                                const newSubControlblocks = new Controlblocks({
                                    _id                     : new mongoose.Types.ObjectId(), 
                                    controlBlocksCode       : baseControlblock.controlBlocksCode,
                                    controlBlockRef         : baseControlblock.controlBlockRef,
                                    controlBlockName        : baseControlblock.controlBlockName,
                                    controlBlockDesc        : baseControlblock.controlBlockDesc,
                                    parentBlock             : baseControlblock.parentBlock,
                                    domain_ID               : baseControlblock.domain_ID,
                                    sequence                : sequence,
                                    weightage               : baseControlblock.weightage,
                                    company_ID              : company_ID,
                                    subControlBlocks        : newSubCB,
                                    createdBy               : createdBy,
                                    ref_contolBlock_ID      : baseControlblock._id,
                                    createdAt               : new Date(),
                                });
                                newSubControlblocks.save()
                                                .then(subcontrolblock=>{
                                                    fetchNewControl();
                                                    async function fetchNewControl(){
                                                        var newControlLst = [];
                                                        var listControls  = baseControlblock.controls;
                                                        console.log()
                                                        for(j = 0 ; j < listControls.length ; j++){
                                                            var newControl_ID = await duplicate_controls({
                                                                                                    control_ID      : listControls[j].control_ID,
                                                                                                    company_ID      : company_ID,
                                                                                                    createdBy       : createdBy,
                                                                                                    controlBlocks_ID : subcontrolblock._id,
                                                                                                });
                                                            if(newControl_ID == "Control Not Found"){
                                                                res.status(200).json("Control Not Found");
                                                            }else{
                                                                newControlLst.push({"control_ID":newControl_ID});
                                                            }
                                                        }//listControls end
                                                        if(j >= listControls.length){
                                                            Controlblocks.updateOne(
                                                                            {_id:subcontrolblock._id},
                                                                            {
                                                                                $set :{
                                                                                    controls : newControlLst
                                                                                }
                                                                            }
                                                                        )
                                                                        .exec()
                                                                        .then(d1=>{
                                                                            resolve(subcontrolblock._id)
                                                                        })
                                                                        .catch(err =>{
                                                                            console.log(err);
                                                                            reject(err);
                                                                        });                                     
                                                        }
                                                    }
                                                })
                                                .catch(err =>{
                                                    console.log(err);
                                                    reject(err);
                                                });                 
                            }
                        };
                    }else{
                        resolve("Control Not found")
                    }
                })
                .catch(err =>{
                        console.log(err);
                        reject(err);
                    });
    });
}

function duplicate_controls(Oldcontrol){
    var company_ID = Oldcontrol.company_ID;
    var createdBy = Oldcontrol.createdBy;
    var controlBlocks_ID = Oldcontrol.controlBlocks_ID;
    return new Promise(function(resolve,reject){
        Control.findOne({_id:Oldcontrol.control_ID})
                .exec()
                .then(baseControl=>{
                    if(baseControl){
                        const control = new Control({
                            _id                     : new mongoose.Types.ObjectId(),
                            controlShort            : baseControl.controlShort, 
                            controlDesc             : baseControl.controlDesc,
                            controltag_ID           : baseControl.controltag_ID,
                            ref1                    : baseControl.ref1,
                            ref2                    : baseControl.ref2,
                            ref3                    : baseControl.ref3,
                            risk                    : baseControl.risk,
                            multiplier              : baseControl.multiplier,
                            mandatory               : baseControl.mandatory,
                            scored                  : baseControl.scored, 
                            controlBlocks_ID        : controlBlocks_ID,
                            company_ID              : company_ID,
                            createdBy               : createdBy,
                            ref_control_ID          : baseControl._id,
                            createdAt               : new Date(),
                        });
                        control.save()
                            .then(data=>{
                                   resolve(data._id);
                            })
                            .catch(err =>{
                                console.log(err);
                                reject(err);
                            });
                    }else{ //end of baseControl
                        resolve("Control Not found")
                    }
                })
                .catch(err =>{
                        console.log(err);
                        reject(err);
                    });
    });
}

function return_frameworkID(){
    return new Promise(function(resolve,reject){
        Framework.estimatedDocumentCount()
                 .exec()
                 .then(count=>{
                    resolve(count)
                 })
                 .catch(err=>{
                    reject(err)
                 });
    });
}
exports.create_framework = (req,res,next)=>{
	Framework.findOne({frameworkname:req.body.frameworkname,version:req.body.version})
		.exec()
		.then(data =>{
			if(data){
				return res.status(200).json({
					message: 'Framework already exists'
				});
			}else{
                getData();
                async function getData(){
                    var maxCount = await return_frameworkID();
    				const framework = new Framework({
                        _id                 : new mongoose.Types.ObjectId(),
                        frameworkID         : maxCount+1,
                        frameworktype       : req.body.frameworktype,
                        frameworkname       : req.body.frameworkname,
                        purpose             : req.body.purpose,
                        domain_ID           : req.body.domain_ID,
                        company_ID          : req.body.company_ID,
                        createdBy           : req.body.createdBy, 
                        ref_framework_ID    : req.body.ref_framework_ID,
                        state               : req.body.state,
                        stage               : req.body.stage,
                        version             : req.body.version,
                        controlBlocks       : req.body.controlBlocks,
                        createdAt           : new Date(),
                    });
                    framework.save()
                        .then(data=>{
                            res.status(200).json({message: "Framework Added",ID:data._id});
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                        });
                            });
                }
			}
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
}

exports.create_Customize_framework = (req,res,next)=>{
    Framework   .findOne({_id:req.params.framework_ID})
                .exec()
                .then(frameworkDoc=>{
                    if(frameworkDoc){
                        getData();
                        async function getData(){
                            var newCBArray = [];
                            var changedControlBlock = [];
                            var listControlBlocks   =  frameworkDoc.controlBlocks;
                            for(k = 0 ; k < listControlBlocks.length; k++){
                                var newCB = await duplicate_controlBlocks({
                                                                        controlBlocks_ID : listControlBlocks[k].controlBlocks_ID,
                                                                        sequence         : req.body.sequence,
                                                                        company_ID       : req.body.company_ID,
                                                                        createdBy        : req.body.createdBy
                                                                    });
                                if(newCB == "Control Not found"){
                                    res.status(200).json({message:"Control Block Not Found"})
                                }
                                newCBArray.push({"controlBlocks_ID":newCB});
                            }
                            if(k >= listControlBlocks.length){
                                var maxCount = await return_frameworkID();
                                const framework = new Framework({
                                                                    _id                 : new mongoose.Types.ObjectId(),
                                                                    frameworkID         : maxCount+1,
                                                                    frameworktype       : "Customize",
                                                                    frameworkname       : frameworkDoc.frameworkname,
                                                                    purpose             : frameworkDoc.purpose,
                                                                    domain_ID           : frameworkDoc.domain_ID,
                                                                    company_ID          : req.body.company_ID,
                                                                    createdBy           : req.body.createdBy, 
                                                                    ref_framework_ID    : req.body.ref_framework_ID,
                                                                    state               : req.body.state,
                                                                    stage               : req.body.stage,
                                                                    version             : req.body.version,
                                                                    controlBlocks       : newCBArray, 
                                                                    createdAt           : new Date(),
                                                            });
                                framework.save()
                                        .then(data=>{
                                            res.status(200).json({message: "Framework Duplicated Added",ID:data._id});
                                        })
                                        .catch(err =>{
                                            console.log(err);
                                            res.status(500).json({
                                                error: err
                                            });
                                        });
                            }
                        }
                    }else{
                        res.status(200).json({message:"Framework Not Found"}); 
                    }
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });        
}

exports.list_framework = (req,res,next)=>{
    Framework.find()
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

exports.list_framework_company = (req,res,next)=>{
    Framework.find({company_ID:req.params.company_ID})
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

exports.detail_framework = (req,res,next)=>{
    Framework.findOne({_id:req.params.framework_ID})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('Control tag not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_framework = (req,res,next)=>{
    var frameworknameData = req.body.frameworkname;
    Framework.findOne({frameworkname:frameworknameData.toLowerCase(),version:req.body.version})
		.exec()
		.then(data =>{
            console.log('data ',data);
			if(data && data._id !== req.body.id){
				return res.status(200).json({
					message: 'Framework already exists'
				});
			}else{

				Framework.updateOne(
                    { _id:req.body.id},  
                    {
                        $set:{
                            'frameworktype'       : req.body.frameworktype,
                            'frameworkname'       : frameworknameData.toLowerCase(),
                            'purpose'             : req.body.purpose,
                            'domain_ID'           : req.body.domain_ID,
                            'ref_framework_ID'    : req.body.ref_framework_ID,
                            'state'               : req.body.state,
                            'stage'               : req.body.stage,
                            'version'             : req.body.version,
                        }
                    }
                )
                .exec()
                .then(data=>{
                    console.log('data ',data);
                    if(data.nModified == 1){
                        res.status(200).json("Framework Updated");
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
exports.update_framework_stage_state = (req,res,next)=>{
    // console.log("req.body.id",req.body.id);
    Framework.findOne({"_id" : req.body.id})
        .exec()
        .then(data =>{
            console.log('data ',data);
            if (data) {
                if(data._id != req.body.id){
                    return res.status(200).json({
                        message: 'Not valid framework'
                    });
                }else{
                    Framework.updateOne(
                        { _id:req.body.id},  
                        {
                            $set:{
                                'state'               : req.body.state,
                                'stage'               : req.body.stage,
                                'version'             : req.body.version,
                            }
                        }
                    )
                    .exec()
                    .then(data=>{
                        console.log('data ',data);
                        if(data.nModified == 1){
                            res.status(200).json("Framework Published");
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
            }else{
                return res.status(401).json({
                    message: 'Framework not exists'
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
    switch(req.params.action){
        case 'add'      :
            Framework.updateOne(
                { _id : req.params.framework_ID},  
                {
                    $push:{
                        controlBlocks : {
                            controlBlocks_ID        : req.body.controlBlocks_ID,
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
            Framework.updateOne(
                { _id : req.params.framework_ID},  
                {
                    $pull:{
                        controlBlocks : {
                            controlBlocks_ID        : req.body.controlBlocks_ID,
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
        default         :
            res.status(409).json("Action parameter mismatch");
    }
}

exports.delete_framework = (req,res,next)=>{
    Framework.deleteOne({_id:req.params.framework_ID})
        .exec()
        .then(data=>{
            res.status(200).json("Framework deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
} 

exports.delete_all_framework = (req,res,next)=>{
    Framework.deleteMany({})
        .exec()
        .then(data=>{
            res.status(200).json("All Framework deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.list_framework_stage = (req,res,next)=>{
    // console.log("req.params.company_ID",req.params.company_ID);
    Framework.find({company_ID:req.params.company_ID,stage:req.params.stage,frameworktype:req.params.frameworktype})
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
exports.list_framework_stage_customeradmin = (req,res,next)=>{
    // console.log("req.params.company_ID",req.body);
    Framework.find({company_ID:{$in : req.body.ids},stage:req.body.stage,frameworktype:req.body.frameworktype})
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

exports.list_allcustUserframework_stage = (req,res,next)=>{
    // console.log("req.params.company_ID",req.params.company_ID);
    Framework.find({company_ID:{ $in: [req.params.company_ID,req.params.user_ID ]},stage:req.params.stage,frameworktype:req.params.frameworktype})
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

exports.frameworks_count_of_company = (req,res,next)=>{
    Framework.countDocuments({company_ID : { $in: [req.params.company_ID,req.params.user_ID ]}})
    // Framework.countDocuments({company_ID : req.params.company_ID})
        .exec()
        .then(data=>{
            // console.log("data frameworks",data);
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json({message:'Frameworks not found'});
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
exports.frameworks_count_of_admin = (req,res,next)=>{
    Framework.countDocuments({company_ID : req.params.user_ID })
        .exec()
        .then(data=>{
            console.log("data frameworks",data);
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json({message:'Frameworks not found'});
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
exports.frameworks_count_of_companyUser = (req,res,next)=>{
    Framework.countDocuments({company_ID : { $in: [req.params.company_ID,req.params.user_ID,req.params.riskpro_ID ]}})
    // Framework.countDocuments({company_ID : req.params.company_ID})
        .exec()
        .then(data=>{
            // console.log("data frameworks",data);
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json({message:'Frameworks not found'});
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
exports.frameworks_count_for_cadmin = (req,res,next)=>{
    Framework.countDocuments({company_ID : { $in: req.body.ids}})
        .exec()
        .then(data=>{
            // console.log("data frameworks",data);
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json({message:'Frameworks not found'});
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
//----------------------------Not merged code-------------------------------------
exports.fetch_framework_controlblockDetails = (req,res,next)=>{
    console.log("fetch_framework_controlblockDetails");
    Framework  .aggregate([
                            {
                                $match : {_id : new ObjectID(req.params.framework_ID)}
                            },
                            {
                                $lookup : {
                                        from            : "controlblocks",
                                        localField      : "controlBlocks.controlBlocks_ID",
                                        foreignField    : "_id",
                                        as              : "controlBlock"
                                }
                            },
                            {
                                $unwind : "$controlBlocks"
                            },
                            {
                                $unwind : "$controlBlock"
                            },
                            {
                                $redact: {
                                    $cond: [
                                            {
                                                $eq: [
                                                       "$controlBlocks.controlBlocks_ID",
                                                        "$controlBlock._id"
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
                                    "frameworktype"     : 1,
                                    "frameworkname"     : 1,
                                    "purpose"           : 1,
                                    "domain_ID"         : 1,
                                    "company_ID"        : 1,
                                    "createdBy"         : 1,
                                    "ref_framework_ID"  : 1,
                                    "state"             : 1,
                                    "stage"             : 1,
                                    "version"           : 1,
                                    "controlB"          :{
                                                            "_id"               : "$controlBlocks._id",
                                                            "controlBlocks_ID"  : "$controlBlocks.controlBlocks_ID",
                                                            "controlBlocksCode" : "$controlBlock.controlBlocksCode",
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
                                                        }
                                }
                            },
                            {
                                $group : {
                                    _id : {
                                        "_id"               : "$_id",
                                        "frameworktype"     : "$frameworktype",
                                        "frameworkname"     : "$frameworkname",
                                        "purpose"           : "$purpose",
                                        "domain_ID"         : "$domain_ID",
                                        "company_ID"        : "$company_ID",
                                        "createdBy"         : "$createdBy",
                                        "ref_framework_ID"  : "$ref_framework_ID",
                                        "state"             : "$state",
                                        "stage"             : "$stage",
                                        "version"           : "$version",
                                    },
                                    "controlBlocks"     : {"$push" : "$controlB"}
                                }
                            },
                            {
                                $project : {
                                    "_id"               : "$_id._id",
                                    "frameworktype"     : "$_id.frameworktype",
                                    "frameworkname"     : "$_id.frameworkname",
                                    "purpose"           : "$_id.purpose",
                                    "domain_ID"         : "$_id.domain_ID",
                                    "company_ID"        : "$_id.company_ID",
                                    "createdBy"         : "$_id.createdBy",
                                    "ref_framework_ID"  : "$_id.ref_framework_ID",
                                    "state"             : "$_id.state",
                                    "stage"             : "$_id.stage",
                                    "version"           : "$_id.version",
                                    "controlBlocks"     : 1,
                                }
                            },
                ])
                .exec()
                .then(data=>{
                    res.status(200).json(data[0]);
                })
                .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}