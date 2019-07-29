const mongoose	= require("mongoose");
var request     = require('request-promise');
var ObjectID = require('mongodb').ObjectID;

const Assessments       = require('../../models/tprm/assessments');
const Framework         = require('../../models/tprm/frameworks');

function fetch_cb(newCBList){
    return new Promise(function(resolve,reject){
            var data = request({
                "method"    : "GET", 
                "url"       : "http://localhost:3048/api/controlblocks/fetchcb",
                "body"      : {lstcontrolblocks : newCBList },
                "json"      : true,
                "headers"   : {
                                "User-Agent": "Test Agent"
                            }
            })
            .then(allcb=>{
                resolve(allcb); 
            })
            .catch(err =>{
                console.log(err);
                reject(err);
            });
    })
}// end function

function fetch_controls(newCBList){
    return new Promise(function(resolve,reject){
            var data = request({
                "method"    : "GET", 
                "url"       : "http://localhost:3048/api/controlblocks/fetchcontrols",
                "body"      : {lstcontrolblocks : newCBList },
                "json"      : true,
                "headers"   : {
                                "User-Agent": "Test Agent"
                            }
            })
            .then(allcb_controls=>{
                resolve(allcb_controls); 
            })
            .catch(err =>{
                console.log(err);
                reject(err);
            });
    })
}// end function

exports.create_assessments = (req,res,next)=>{
        Framework   .findOne({_id : new ObjectID(req.body.framework_ID)})
                    .exec()
                    .then(lstcontrolblocks=>{
                        if(lstcontrolblocks){
                            var inputArray = lstcontrolblocks.controlBlocks;
                            var mainCBArray = inputArray;
                            getcb();
                            async function getcb(){
                                do{
                                    var childCBArray = await fetch_cb(inputArray);
                                    inputArray = childCBArray;
                                    if(childCBArray.length > 0){
                                        mainCBArray = mainCBArray.concat(childCBArray);
                                    }
                                }while(childCBArray.length > 0);
                                var controlList = await fetch_controls(mainCBArray);
                                Assessments.estimatedDocumentCount()
                                           .exec()
                                           .then(assessmentCount=>{
                                               const assessment = new Assessments({
                                                            _id                : new mongoose.Types.ObjectId(),
                                                            corporate_ID       : req.body.corporate_ID,
                                                            assessedParty_ID   : req.body.assessedParty_ID,
                                                            framework_ID       : req.body.framework_ID,
                                                            assessmentID       : assessmentCount + 1,
                                                            frequency          : req.body.frequency,
                                                            startDate          : req.body.startDate,
                                                            endDate            : req.body.endDate,
                                                            purpose            : req.body.purpose,
                                                            assessmentMode     : req.body.assessmentMode,
                                                            assessmentStatus   : 'Pending',
                                                            assessmentStages   : 'Open',
                                                            framework          : controlList,
                                                            assessor           : req.body.assessor
                                                            //While inserting control set framework.controlOwner_ID  as SPOC 
                                                });
                                                assessment.save()
                                                          .then(assessment=>{
                                                              if(assessment){
                                                                request({
                                                                    "method"    : "GET", 
                                                                    "url"       : "http://localhost:3048/api/companysettings/list/"+req.body.assessedParty_ID,
                                                                    "json"      : true,
                                                                    "headers"   : {
                                                                                    "User-Agent": "Test Agent"
                                                                                }
                                                                })
                                                                .then(cs=>{
                                                                    console.log('cs SPOC ID',cs.spocDetails.user_ID);
                                                                    Assessments .updateOne(
                                                                                        {"_id":assessment._id, "framework.controlBlock_ID": {$exists: true}},
                                                                                        {
                                                                                            "$set" : {"framework.$.controlOwner_ID" : cs.spocDetails.user_ID}
                                                                                        },
                                                                                        { "multi": true }
                                                                                )
                                                                                .exec()
                                                                                .then(assessmentUpdate=>{
                                                                                    if(assessmentUpdate.nModified == 1){
                                                                                        res.status(200).json({message:"Assessment Created Succussfully",ID:assessment._id});
                                                                                    }else{
                                                                                        res.status(200).json({message:"Assessment Created but SPOC details not updated",ID:assessment._id});
                                                                                    }
                                                                                })
                                                                                .catch(err =>{
                                                                                    console.log(err);
                                                                                    res.status(500).json(err);
                                                                                });                 
                                                                })
                                                                .catch(err =>{
                                                                    console.log(err);
                                                                    reject(err);
                                                                });
                                                              }
                                                          })
                                                          .catch(err =>{
                                                            console.log(err);
                                                            res.status(500).json({
                                                                error: err
                                                            });
                                                        });
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

};

exports.list_assessments = (req,res,next)=>{
    Assessments.find()
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

exports.list_assessments_company_ID = (req,res,next)=>{
    Assessments.find({corporate_ID:req.params.corporate_ID})
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

exports.list_assessments_assessedParty_ID = (req,res,next)=>{
    Assessments.find({assessedParty_ID:req.params.assessedParty_ID})
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

exports.detail_assessments = (req,res,next)=>{
    Assessments.findOne({_id:req.params.assessments_ID})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('assessments not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_assessments = (req,res,next)=>{
    Assessments.findOne({_id:req.params.assessments_ID})
		.exec()
		.then(data =>{
			if(data && data._id != req.body.id){
				return res.status(200).json({
					message: 'assessmentss already exists'
				});
			}else{
				Assessments.updateOne(
                                { _id:req.body.id},  
                                {
                                    $set:{
                                        "assessments" : assessmentssData.toLowerCase()
                                    }
                                }
                            )
                            .exec()
                            .then(data=>{
                                console.log('data ',data);
                                if(data){
                                    res.status(200).json("assessmentss Updated");
                                }else{
                                    res.status(401).json("assessments Not Found");
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

exports.delete_assessments = (req,res,next)=>{
    Assessments.deleteOne({_id:req.params.assessments_ID})
        .exec()
        .then(data=>{
            console.log('data ',data);
            if(data.deletedCount == 1){
                res.status(200).json("assessments deleted");
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

exports.delete_all_assessments = (req,res,next)=>{
    Assessments.deleteMany({})
        .exec()
        .then(data=>{
            res.status(200).json("All assessments deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_assessmentStatus = (req,res,next)=>{
    Assessments.updateOne(
                            { _id:req.params.assessments_ID},  
                            {
                                $set:{
                                    "assessmentStatus" : req.params.status
                                }
                            }
                        )
                        .exec()
                        .then(data=>{
                            console.log('data ',data);
                            if(data){
                                res.status(200).json("assessmentStatus Updated");
                            }else{
                                res.status(401).json("assessmentStatus Not Found");
                            }
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
}

exports.update_response = (req,res,next)=>{
    console.log("response",req.body);
    Assessments.updateOne(
                            {
                                "_id"                       : req.body.assessment_ID,
                                "framework.controlBlock_ID" : req.body.controlBlock_ID,
                                "framework.control_ID"      : req.body.control_ID,
                            },
                            {
                                $set : {
                                    "framework.$.response.response"  : req.body.response,
                                    "framework.$.response.document"  : req.body.document,
                                    "framework.$.response.comment"   : req.body.comment,                                               
                                }
                            }
                )
                .exec()
                .then(data=>{
                    if(data.nModified == 1){
                        Assessments.findOne(
                                            {
                                                "_id"                         : req.body.assessment_ID,
                                                "framework.response.response" : { $exists : true }
                                            },
                                            {
                                                $set : {assessmentStatus : "Mark for Review"}
                                            }
                                    )
                                    .exec()
                                    .then(assessmentStages=>{
                                        res.status(200).json(assessmentStages);
                                        // if(assessmentStages.nModified == 1){
                                        //     res.status(200).json({message:"Response updated and assessmentStages changed to Mark as Review"})                 
                                        // }else{
                                        //     res.status(200).json({message:"Response updated"})
                                        // }
                                    })
                                    .catch(err =>{
                                        console.log(err);
                                        res.status(500).json({
                                            error: err
                                        });
                                    });
                        // res.status(200).json({message:"Response updated"})
                    }else{
                        res.status(200).json({message:"Response not updated"})
                    }
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
}

exports.fetch_specific_framework = (req,res,next)=>{
    Assessments.find(
                        {
                            "_id"                       : req.params.assessments_ID,
                            "framework.controlBlock_ID" : req.params.controlBlock_ID,
                            "framework.control_ID"      : req.params.control_ID,
                        },
                        {
                            "framework.$" : 1
                        }
                )
                .exec()
                .then(data=>{
                    request({
                        "method"    : "GET", 
                        "url"       : "http://localhost:3048/api/controlblocks/"+req.params.controlBlock_ID,
                        "json"      : true,
                        "headers"   : {
                                        "User-Agent": "Test Agent"
                                    }
                    })
                    .then(cb=>{
                        request({
                            "method"    : "GET", 
                            "url"       : "http://localhost:3048/api/controls/"+req.params.control_ID,
                            "json"      : true,
                            "headers"   : {
                                            "User-Agent": "Test Agent"
                                        }
                        })
                        .then(c=>{
                            var framework = {
                                _id                 : data[0]._id,
                                framework_ID        : data[0].framework[0]._id,
                                controlBlock_ID     : data[0].framework[0].controlBlock_ID,
                                controlBlockName    : cb.controlBlockName,
                                control_ID          : data[0].framework[0].control_ID,
                                controlName         : c.controlShort,
                                response            : data[0].framework[0].response,
                                nc                  : data[0].framework[0].nc,                                
                            };
                            if(framework){
                                res.status(200).json({framework}); 
                            }
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(200).json(err);
                        });    
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(200).json(err);
                    });
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
}

exports.list_nc_true = (req,res,next) =>{
    // res.status(200).json({"nc_true ":req.params.assessments_ID});
    console.log('assessments_ID ',req.params.assessments_ID);
    Assessments.aggregate([
                                {
                                    $match : { _id       : new ObjectID("5d3e928472e50833827d4074")}
                                },
                                {
                                    $project :{
                                        _id       : 1,
                                        framework : 1,
                                    }
                                },
                                {
                                    $unwind : "$framework"
                                },
                                {
                                    $match : {"framework.nc.ncStatus" : true}
                                },
                                {
                                    $lookup : 
                                            {
                                                "from"          : "controlblocks",
                                                // "let"           : {"controlBlock_ID" : _id, "controlBlockName" : controlBlockName},
                                                // "pipeline"      : [
                                                                        // {$match : {_id : }}
                                                                    // ],
                                                "localField"    : "controlBlock_ID",
                                                "foreignField"    : "_id",
                                                "as"              : "controlBlockName"
                                            }
                                }
                        ])
                    //         {
                    //             "_id"      : req.params.assessments_ID,
                    //             "framework" : {
                    //                 $elemMatch : 
                    //                         {
                    //                             "nc.ncStatus" : true
                    //                         }
                    //             }
                    //         },
                    //         {
                    //             "framework.$" : 1,
                    //         },
                    //         {multi: true}
                    // )
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

exports.fetch_specific_response = (req,res,next)=>{
    Assessments.findOne(
                            {
                                "_id"                       : req.params.assessments_ID,
                                "framework.controlBlock_ID" : req.params.controlBlock_ID,
                                "framework.control_ID"      : req.params.control_ID,
                            },
                            {
                                "framework.$.response" : 1,
                                "framework.$.nc"        : 0,

                            }
                )
                .exec()
                .then(data=>{
                    request({
                                "method"    : "GET", 
                                "url"       : "http://localhost:3048/api/controlblocks/"+req.params.controlBlock_ID,
                                "json"      : true,
                                "headers"   : {
                                                "User-Agent": "Test Agent"
                                            }
                            })
                            .then(cb=>{
                                resolve({cb,data}); 
                            })
                            .catch(err =>{
                                console.log(err);
                                res.status(200).json(err);
                            });
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
}

exports.update_ncstatus = (req,res,next)=>{
    console.log('params ',req.params);
    if(req.params.ncStatus === 'true'){
        Assessments.updateOne(
                                {
                                    "_id"                       : req.params.assessments_ID,
                                    "framework.controlBlock_ID" : req.params.controlBlock_ID,
                                    "framework.control_ID"      : req.params.control_ID,
                                },
                                {
                                    $set : {
                                        "framework.$.nc.ncStatus"  : req.params.ncStatus,
                                        "framework.$.nc.status"    : 'Open',
                                    }
                                }
                    )
                    .exec()
                    .then(data=>{
                        if(data.nModified == 1){
                            res.status(200).json({message:"NC Status and Status updated"})
                        }else{
                            res.status(200).json({message:"NC Status and Status not updated"})
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
    }else{
        Assessments.updateOne(
                        {
                            "_id"                       : req.params.assessments_ID,
                            "framework.controlBlock_ID" : req.params.controlBlock_ID,
                            "framework.control_ID"      : req.params.control_ID,
                        },
                        {
                            $set : {
                                "framework.$.nc.ncStatus"  : req.params.ncStatus,
                            }
                        }
            )
            .exec()
            .then(data=>{
                if(data.nModified == 1){
                    res.status(200).json({message:"NC Status updated"})
                }else{
                    res.status(200).json({message:"NC Status not updated"})
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    }
    
}

exports.operation_actionPlan = (req,res,next)=>{
    switch(req.params.action){
        case 'add' :
            Assessments .updateOne(
                                { 
                                    "_id"                       : req.params.assessments_ID,
                                    "framework.controlBlock_ID" : req.body.controlBlock_ID,
                                    "framework.control_ID"      : req.body.control_ID,
                                },
                                {
                                    $push : {
                                        "nc.actionPlan" :
                                            {
                                                type            : req.body.type,
                                                plan            : req.body.plan,
                                                priority        : req.body.priority,
                                                owner_ID        : req.body.owner_ID,
                                                planDate        : req.body.planDate,
                                                dueDate         : req.body.dueDate,
                                                coordinator_ID  : req.body.coordinator_ID,
                                                status          : req.body.status, //Open 
                                                document        : req.body.document,
                                                actionTaken     : req.body.actionTaken
                                            }
                                    }
                                }
                        )
                        .exec()
                        .then(data=>{
                            res.status(200).json({message:"Action Plan Added"})
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        }); 
            // res.status(200).json({message:"add"});
            break;
        case 'remove' :
                Assessments .updateOne(
                                        { _id : req.params.assessments_ID},
                                        {
                                            $pull:{
                                                actionPlan : {
                                                    _id        : req.body.actionPlan_ID,
                                                }
                                            }
                                        }
                            )
                            .exec()
                            .then(data=>{
                                if(data.deletedCount == 1){
                                    res.status(200).json({message:"Action Plan Removed"})
                                }else{
                                    res.status(200).json({message:"Action Plan Not Removed"})
                                }
                            })
                            .catch(err =>{
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            }); 
            break;
        case 'edit'  :
                Assessments .updateOne(
                                    { _id : req.params.assessments_ID , "framework.actionPlan._id" : req.body.actionPlan_ID},
                                    {
                                        $set : {
                                                    "actionPlan.$.type"            : req.body.type,
                                                    "actionPlan.$.plan"            : req.body.plan,
                                                    "actionPlan.$.priority"        : req.body.priority,
                                                    "actionPlan.$.owner_ID"        : req.body.owner_ID,
                                                    "actionPlan.$.planDate"        : req.body.planDate,
                                                    "actionPlan.$.dueDate"         : req.body.dueDate,
                                                    "actionPlan.$.coordinator_ID"  : req.body.coordinator_ID,
                                                    "actionPlan.$.status"          : req.body.status, //Open 
                                                    "actionPlan.$.document"        : req.body.document,
                                                    "actionPlan.$.actionTaken"     : req.body.actionTaken
                                                }
                                    }
                            )
                            .exec()
                            .then(data=>{
                                if(data.deletedCount == 1){
                                    res.status(200).json({message:"Action Plan Updated"})
                                }else{
                                    res.status(200).json({message:"Action Plan Not Updated"})
                                }
                            })
                            .catch(err =>{
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            }); 
            break;
        default :
            res.status(200).json({message:"Invalid Action"});
    }
}
