const mongoose  = require("mongoose");
var request = require('request-promise');
var ObjectID = require('mongodb').ObjectID;
const globalVariable = require("../../../nodemon.js");

const Assessments = require('../../models/tprm/assessments');
const Framework = require('../../models/tprm/frameworks');

function fetch_cb(newCBList){
    return new Promise(function(resolve,reject){
            var data = request({
                "method"    : "GET", 
                "url"       : "http://localhost:"+globalVariable.port+"/api/controlblocks/fetchcb",
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
                "url"       : "http://localhost:"+globalVariable.port+"/api/controlblocks/fetchcontrols",
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

function fetch_controlShort(control_ID){
    return new Promise(function(resolve,reject){
        request({
            "method"    : "GET", 
            "url"       : "http://localhost:"+globalVariable.port+"/api/controls/"+control_ID,
            "json"      : true,
            "headers"   : {
                            "User-Agent": "Test Agent"
                        }
        })
        .then(control=>{
            resolve(control.controlShort); 
        })
        .catch(err =>{
            console.log(err);
            reject(err);
        });
    })
}

function fetch_controlBlockName(controlBlock_ID){
    return new Promise(function(resolve,reject){
        request({
            "method"    : "GET", 
            "url"       : "http://localhost:"+globalVariable.port+"/api/controlblocks/"+controlBlock_ID,
            "json"      : true,
            "headers"   : {
                            "User-Agent": "Test Agent"
                        }
        })
        .then(controlBlock=>{
            resolve(controlBlock.controlBlockName); 
        })
        .catch(err =>{
            console.log(err);
            reject(err);
        });
    })
}

function fetch_controlOwnerName(user_ID){
    return new Promise(function(resolve,reject){
        request({
            "method"    : "GET", 
            "url"       : "http://localhost:"+globalVariable.port+"/api/users/"+user_ID,
            "json"      : true,
            "headers"   : {
                            "User-Agent": "Test Agent"
                        }
        })
        .then(user=>{
            resolve(user.profile.fullName); 
        })
        .catch(err =>{
            console.log(err);
            reject(err);
        });
    })
}

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
                            request({
                                    "method"    : "GET", 
                                    "url"       : "http://localhost:"+globalVariable.port+"/api/companysettings/list/"+req.body.assessedParty_ID,
                                    "json"      : true,
                                    "headers"   : {
                                                    "User-Agent": "Test Agent"
                                                }
                                })
                                .then(cs=>{
                                    var p = 0;
                                    for(p = 0 ; p < controlList.length ; p++){
                                        controlList[p].controlOwner_ID = cs.spocDetails.user_ID;
                                    }                 
                                    if(p >= controlList.length){
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
                                                            assessor           : req.body.assessor,
                                                            framework          : controlList,
                                                        });
                                                        assessment.save()
                                                                .then(assessment=>{
                                                                    if(assessment){
                                                                        res.status(200).json({message:"Assessment Created",ID:assessment._id})
                                                                    }else{
                                                                        res.status(200).json({message:"Assessment Not Created"})
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
                                })
                                .catch(err =>{
                                    console.log(err);
                                    reject(err);
                                });
                            
                        }//End of async
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
    Assessments.updateOne(
                    { _id:req.params.assessments_ID},
                    {
                        $set:{
                            frequency          : req.body.frequency,
                            startDate          : req.body.startDate,
                            endDate            : req.body.endDate,
                            purpose            : req.body.purpose,
                            assessmentMode     : req.body.assessmentMode,
                            assessmentStatus   : req.body.assessmentStatus,
                            assessmentStages   : req.body.assessmentStages,
                        }
                    }
                )
                .exec()
                .then(data=>{
                    console.log('data ',data);
                    if(data.nModified == 1){
                        res.status(200).json("assessmentss Updated");
                    }else{
                        res.status(401).json("assessments Not Updated");
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

exports.update_assessmentStages = (req,res,next)=>{
    Assessments.updateOne(
                    { _id:req.params.assessments_ID},
                    {
                        $set:{
                            "assessmentStages" : req.params.status
                        }
                    }
                )
                .exec()
                .then(data=>{
                    console.log('data ',data);
                    if(data){
                        res.status(200).json("assessmentStages Updated");
                    }else{
                        res.status(200).json("assessmentStages Not Found");
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
    Assessments.updateOne(
                        {
                            "_id" : req.body.assessment_ID,
                            "framework.controlBlock_ID" : req.body.controlBlock_ID,
                            "framework.control_ID" : req.body.control_ID,
                        },
                        {
                            $set : {
                                "framework.$.response.response" : req.body.response,
                                "framework.$.response.document" : req.body.document,
                                "framework.$.response.comment" : req.body.comment,
                            }
                        }
                )
                .exec()
                .then(data=>{
                    if(data.nModified == 1){
                        res.status(200).json({message:"Response updated"});
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
                        "url"       : "http://localhost:"+globalVariable.port+"/api/controlblocks/"+req.params.controlBlock_ID,
                        "json"      : true,
                        "headers"   : {
                                        "User-Agent": "Test Agent"
                                    }
                    })
                    .then(cb=>{
                        request({
                            "method"    : "GET", 
                            "url"       : "http://localhost:"+globalVariable.port+"/api/controls/"+req.params.control_ID,
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
                                controlOwner_ID     : data[0].framework[0].controlOwner_ID,
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
    Assessments.aggregate([
                            {
                                $match : { _id       : new ObjectID(req.params.assessments_ID)}
                            },
                            {
                                $project :{
                                    _id       : 1,
                                    framework : 1,
                                    assessedParty_ID : 1,
                                    framework_ID : 1,
                                }
                            },
                            {
                                $unwind : "$framework"
                            },
                            {
                                $match : {"framework.nc.ncStatus" : true}
                            }
                        ])
                .exec()
                .then(data=>{
                        var ncData = [];
                        setNCDate();
                        async function setNCDate(){
                            for(i=0;i<data.length;i++){
                                if(data[i].framework.control_ID){
                                    var controlDesc = await fetch_controlShort(data[i].framework.control_ID);
                                }else{
                                	var controlDesc = ''; 
                                }
                                if(data[i].framework.controlBlock_ID){
                                    var contorlBlockName = await fetch_controlBlockName(data[i].framework.controlBlock_ID);
                                }else{
                                	var contorlBlockName = '';
                                }
                                if(data[i].framework.controlOwner_ID){
                                    var controlOwnerName = await fetch_controlOwnerName(data[i].framework.controlOwner_ID);	
                                }else{
                                	var controlOwnerName = '';
                                }
                                ncData.push({
                                    "_id" : data[i]._id,
                                    "control_ID" : data[i].framework.control_ID,
                                    "controlDesc" : controlDesc,
                                    "controlBlock_ID" : data[i].framework.controlBlock_ID,
                                    "controlBlockName" : contorlBlockName,
                                    "controlOwner_ID" : data[i].framework.controlOwner_ID,
                                    "controlOwnerName" : controlOwnerName,
                                    "response" : data[i].framework.response,
                                    "nc" : data[i].framework.nc,
                                    "framework_ID":data[i].framework_ID,
                                    "assessedParty_ID":data[i].assessedParty_ID
                                });
                            }
                            if(i >= data.length){
                                res.status(200).json(ncData);
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

exports.list_AllNC_true = (req,res,next) =>{
    Assessments.aggregate([
                            {
                                $match : {'corporate_ID':new ObjectID(req.params.corporate_ID)}
                            },
                            {
                                $project :{
                                    _id       : 1,
                                    framework : 1,
                                    assessedParty_ID : 1,
                                    framework_ID : 1,
                                }
                            },
                            {
                                $unwind : "$framework"
                            },
                            {
                                $match : {"framework.nc.ncStatus" : true}
                            }
                        ])
                .exec()
                .then(data=>{
                    var ncData = [];
                    setNCDate();
                    async function setNCDate(){
                        for(i=0;i<data.length;i++){
                            if(data[i].framework.control_ID){
                                var controlDesc = await fetch_controlShort(data[i].framework.control_ID);
                            }else{
                            	var controlDesc = ''; 
                            }
                            if(data[i].framework.controlBlock_ID){
                                var contorlBlockName = await fetch_controlBlockName(data[i].framework.controlBlock_ID);
                            }else{
                            	var contorlBlockName = '';
                            }
                            if(data[i].framework.controlOwner_ID){
                                var controlOwnerName = await fetch_controlOwnerName(data[i].framework.controlOwner_ID);	
                            }else{
                            	var controlOwnerName = '';
                            }
                            ncData.push({
                                "_id" : data[i]._id,
                                "control_ID" : data[i].framework.control_ID,
                                "controlDesc" : controlDesc,
                                "controlBlock_ID" : data[i].framework.controlBlock_ID,
                                "controlBlockName" : contorlBlockName,
                                "controlOwner_ID" : data[i].framework.controlOwner_ID,
                                "controlOwnerName" : controlOwnerName,
                                "response" : data[i].framework.response,
                                "nc" : data[i].framework.nc,
                                "framework_ID":data[i].framework_ID,
                                "assessedParty_ID":data[i].assessedParty_ID,
                            });
                        }
                        if(i >= data.length){
                            res.status(200).json(ncData);
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

exports.list_actionplan_assessedParty_ID = (req,res,next) =>{
    Assessments.aggregate([
                            {
                                $match : {'assessedParty_ID':new ObjectID(req.params.assessedParty_ID)}
                            },
                            {
                                $project :{
                                _id       : 1,
                                framework : 1,
                                corporate_ID : 1,
                                framework_ID : 1,
                                }
                            },
                            {
                                $unwind : "$framework"
                            },
                            {
                                $match : {"framework.nc.ncStatus" : true}
                            }
                        ])
                .exec()
                .then(data=>{
                    var ncData = [];
                    setNCDate();
                    async function setNCDate(){
                        for(i=0;i<data.length;i++){
                            if(data[i].framework.control_ID){
                                var controlDesc = await fetch_controlShort(data[i].framework.control_ID);
                            }else{
                            	var controlDesc = ''; 
                            }
                            if(data[i].framework.controlBlock_ID){
                                var contorlBlockName = await fetch_controlBlockName(data[i].framework.controlBlock_ID);
                            }else{
                            	var contorlBlockName = '';
                            }
                            if(data[i].framework.controlOwner_ID){
                                var controlOwnerName = await fetch_controlOwnerName(data[i].framework.controlOwner_ID);	
                            }else{
                            	var controlOwnerName = '';
                            }
                            if(data[i].framework.nc.actionPlan && data[i].framework.nc.actionPlan.length > 0){
                            	for (var j = 0; j < data[i].framework.nc.actionPlan.length; j++) {
                            		ncData.push({
                                		"_id" : data[i]._id,
                                		"control_ID" : data[i].framework.control_ID,
                                		"controlDesc" : controlDesc,
                                		"controlBlock_ID" : data[i].framework.controlBlock_ID,
                                		"controlBlockName" : contorlBlockName,
                                		"controlOwner_ID" : data[i].framework.controlOwner_ID,
                                		"controlOwnerName" : controlOwnerName,
                                		"response" : data[i].framework.response,
                                		"nc" : data[i].framework.nc,
                                		"framework_ID":data[i].framework_ID,
                                		"corporate_ID":data[i].corporate_ID,
                                		"actionPlan" :data[i].framework.nc.actionPlan[j]
                            		});
	                           }
                            }
                        }
                        if(i >= data.length){
                            res.status(200).json(ncData);
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

exports.list_actionplan_corporate_ID = (req,res,next) =>{
    Assessments.aggregate([
                            {
                                $match : {'corporate_ID':new ObjectID(req.params.corporate_ID)}
                            },
                            {
                                $project :{
                                    _id       : 1,
                                    framework : 1,
                                    assessedParty_ID : 1,
                                    framework_ID : 1,
                                }
                            },
                            {
                                $unwind : "$framework"
                            },
                            {
                                $match : {"framework.nc.ncStatus" : true}
                            }
                        ])
                .exec()
                .then(data=>{
                    var ncData = [];
                    setNCDate();
                    async function setNCDate(){
                        for(i=0;i<data.length;i++){
                            if(data[i].framework.control_ID){
                                var controlDesc = await fetch_controlShort(data[i].framework.control_ID);
                            }else{
                            	var controlDesc = ''; 
                            }
                            if(data[i].framework.controlBlock_ID){
                                var contorlBlockName = await fetch_controlBlockName(data[i].framework.controlBlock_ID);
                            }else{
                            	var contorlBlockName = '';
                            }
                            if(data[i].framework.controlOwner_ID){
                                var controlOwnerName = await fetch_controlOwnerName(data[i].framework.controlOwner_ID);	
                            }else{
                            	var controlOwnerName = '';
                            }
                            if(data[i].framework.nc.actionPlan&&data[i].framework.nc.actionPlan.length>0){
                            	for (var j = 0; j < data[i].framework.nc.actionPlan.length; j++) {
                            		ncData.push({
                                		"_id" : data[i]._id,
                                		"control_ID" : data[i].framework.control_ID,
                                		"controlDesc" : controlDesc,
                                		"controlBlock_ID" : data[i].framework.controlBlock_ID,
                                		"controlBlockName" : contorlBlockName,
                                		"controlOwner_ID" : data[i].framework.controlOwner_ID,
                                		"controlOwnerName" : controlOwnerName,
                                		"response" : data[i].framework.response,
                                		"nc" : data[i].framework.nc,
                                		"framework_ID":data[i].framework_ID,
                                		"assessedParty_ID":data[i].assessedParty_ID,
                                		"actionPlan" :data[i].framework.nc.actionPlan[j]
                            		});
                            	}
                            }
                        }
                        if(i >= data.length){
                            res.status(200).json(ncData);
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

exports.list_actionplan_assessments_ID = (req,res,next) =>{
    Assessments.aggregate([
                                {
                                    $match : {_id : new ObjectID(req.params.assessments_ID)}
                                },
                                {
                                    $project :{
                                        _id       : 1,
                                        framework : 1,
                                        assessedParty_ID : 1,
                                        framework_ID : 1,
                                    }
                                },
                                {
                                    $unwind : "$framework"
                                },
                                {
                                    $match : {"framework.nc.ncStatus" : true}
                                }
                        ])
                .exec()
                .then(data=>{
                    var ncData = [];
                    setNCDate();
                    async function setNCDate(){
                        for(i=0;i<data.length;i++){
                            if(data[i].framework.control_ID){
                                var controlDesc = await fetch_controlShort(data[i].framework.control_ID);
                            }else{
                            	var controlDesc = ''; 
                            }
                            if(data[i].framework.controlBlock_ID){
                                var contorlBlockName = await fetch_controlBlockName(data[i].framework.controlBlock_ID);
                            }else{
                            	var contorlBlockName = '';
                            }
                            if(data[i].framework.controlOwner_ID){
                                var controlOwnerName = await fetch_controlOwnerName(data[i].framework.controlOwner_ID);	
                            }else{
                            	var controlOwnerName = '';
                            }
                            if(data[i].framework.nc.actionPlan&&data[i].framework.nc.actionPlan.length>0){
                            	for (var j = 0; j < data[i].framework.nc.actionPlan.length; j++) {
                            		ncData.push({
                                		"_id" : data[i]._id,
                                		"control_ID" : data[i].framework.control_ID,
                                		"controlDesc" : controlDesc,
                                		"controlBlock_ID" : data[i].framework.controlBlock_ID,
                                		"controlBlockName" : contorlBlockName,
                                		"controlOwner_ID" : data[i].framework.controlOwner_ID,
                                		"controlOwnerName" : controlOwnerName,
                                		"response" : data[i].framework.response,
                                		"nc" : data[i].framework.nc,
                                		"framework_ID":data[i].framework_ID,
                                		"assessedParty_ID":data[i].assessedParty_ID,
                                		"actionPlan" :data[i].framework.nc.actionPlan[j]
                            		});
                            	}
                            }
                        }
                        if(i >= data.length){
                            res.status(200).json(ncData);
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
                                "url"       : "http://localhost:"+globalVariable.port+"/api/controlblocks/"+req.params.controlBlock_ID,
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
                                        "framework.$.nc.remark"    : req.body.remark,
                                        "framework.$.nc.Criticality"    : req.body.criticality,
                                        "framework.$.nc.date"    		: new Date(),
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
	console.log('req',req.params,req.body);
    switch(req.params.action){
        case 'add' :
            Assessments .aggregate([
                                        {
                                            $match : {
                                                    "_id"    : new ObjectID(req.params.assessments_ID),
                                            }
                                        },
                                        {
                                            $unwind : "$framework"
                                        },
                                        {
                                            $match : {
                                                "framework.controlBlock_ID" : new ObjectID(req.body.controlBlock_ID),
                                                "framework.control_ID"      : new ObjectID(req.body.control_ID)
                                            }
                                        },
                                        {
                                            $project : {"count" : { $size : "$framework.nc.actionPlan"}}
                                        },

                                    ]
                        )
                        .exec()
                        .then(count_actionPlan=>{
                                Assessments .updateOne(
                                                        {
                                                            "_id"                       : req.params.assessments_ID,
                                                            "framework.controlBlock_ID" : req.body.controlBlock_ID,
                                                            "framework.control_ID"      : req.body.control_ID,
                                                        },
                                                        {
                                                            $push : {
                                                                "framework.$.nc.actionPlan" :
                                                                            {
                                                                                actionID        : count_actionPlan[0].count + 1,
                                                                                actionPlan_type : req.body.actionPlan_type,
                                                                                plan            : req.body.plan,
                                                                                priority        : req.body.priority,
                                                                                owner_ID        : req.body.owner_ID,
                                                                                planDate        : req.body.planDate,
                                                                                dueDate         : req.body.dueDate,
                                                                                coordinator_ID  : req.body.coordinator_ID,
                                                                                status          : req.body.status, //Open
                                                                                // document        : req.body.document,
                                                                                // actionTaken     : req.body.actionTaken
                                                                            }
                                                            }
                                                        }
                                                    )
                                            .exec()
                                            .then(data=>{
                                                if(data.nModified == 1){
                                                    res.status(200).json({message:"Action Plan Added"})
                                                }else{
                                                    res.status(200).json({message:"Action Plan Not Added"})
                                                }

                                            })
                                            .catch(err =>{
                                                console.log(err);
                                                res.status(500).json({
                                                    error: err
                                                });
                                            });
                                // res.status(200).json(data)
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
            
            break;
        case 'remove' :
            Assessments .updateOne(
                                    {
                                        "_id"                       : req.params.assessments_ID,
                                        "framework.controlBlock_ID" : req.body.controlBlock_ID,
                                        "framework.control_ID"      : req.body.control_ID,
                                    },
                                    {
                                        $pull:{
                                            "framework.$.nc.actionPlan" : {
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
        case 'status'  :
            Assessments.findOne(
                                    {
                                        "_id"     : req.params.assessments_ID,
                                    }
                                )
                        .exec()
                        .then(assessmentData=>{
                        	if(assessmentData.framework&&assessmentData.framework.length>0){
                        		for (var i = 0; i < assessmentData.framework.length; i++) {
                        			if(assessmentData.framework[i].controlBlock_ID==req.body.controlBlock_ID&&assessmentData.framework[i].control_ID==req.body.control_ID){
                        				var count = 0;
                        				if(assessmentData.framework[i].nc.actionPlan&&assessmentData.framework[i].nc.actionPlan.length>0){
                        	                for (var j = 0; j < assessmentData.framework[i].nc.actionPlan.length; j++) {
                        	                    if(assessmentData.framework[i].nc.actionPlan[j].status=='Accepted'){
                        	                        count++;
                        	                    }
                        	                }
                        				}
                                        if(count==(assessmentData.framework[i].nc.actionPlan.length-1)&&req.body.status=='Accepted'){
                                            var ncStatus = 'Closed';
                                        }else{
                                            var ncStatus = 'Open';
                                        }
                        				Assessments .updateOne(
				                                                {
                                                    				"_id"                                   : req.params.assessments_ID,
                                                    				["framework."+i+".nc.actionPlan._id"]   : req.body.actionPlan_ID
				                                                },
				                                                {
                                                    				$set : {
                                                        				["framework."+i+".nc.status"]          : ncStatus, 
                                                        				["framework."+i+".nc.actionPlan.$.status"]          : req.body.status, //Open
                                                    				}
                                                				}
                                            				)
                                    				.exec()
                                    				.then(data=>{
                                        				if(data.nModified == 1){
                                            				res.status(200).json({message:"Action Plan Status Updated"})
                                        				}else{
                                            				res.status(200).json({message:"Action Plan Status Not Updated"})
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
            Assessments.findOne(
                                    {
                                        "_id"  : req.params.assessments_ID,
                                    }
                                )
                        .exec()
                        .then(assessmentData=>{
                        	if(assessmentData.framework&&assessmentData.framework.length>0){
                        		for (var i = 0; i < assessmentData.framework.length; i++) {
                        			if(assessmentData.framework[i].controlBlock_ID==req.body.controlBlock_ID&&assessmentData.framework[i].control_ID==req.body.control_ID){
                    				    Assessments .updateOne(
                                                				{
                                                    				"_id"                           : req.params.assessments_ID,
                                                    				["framework."+i+".nc.actionPlan._id"]   : req.body.actionPlan_ID
                                                				},
                                                				{
                                                    				$set : {
                                                                				["framework."+i+".nc.actionPlan.$.status"]          : req.body.status, //Open
                                                                				["framework."+i+".nc.actionPlan.$.document"]        : req.body.document,
                                                                				["framework."+i+".nc.actionPlan.$.actionTaken"]     : req.body.actionTaken
                                                            				}
                                                				}
                                            				)
                                    				.exec()
                                    				.then(data=>{
                                        				if(data.nModified == 1){
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
                    			    }
	                            }
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

exports.update_assessor = (req,res,next)=>{
    console.log('update assessor body ',req.body.user_ID," params ", req.params);
    switch(req.params.action){
        case 'add'      :
            Assessments.updateOne(
                                    {_id : req.params.assessments_ID},
                                    {
                                        $push :{
                                            assessor : {
                                               assessor_type   : req.body.assessor_type,
                                                user_ID         : req.body.user_ID
                                            }
                                        }
                                    }
                                )
                        .exec()
                        .then(data=>{
                            console.log('data ',data);
                            if(data.nModified == 1){
                                res.status(200).json({message:"Assessor Added"});
                            }else{
                                res.status(200).json({message:"Assessor Not Added"});
                            }
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
        break;
        case 'edit'     :
            Assessments.updateOne(
                                    {_id : req.params.assessments_ID,"assessor._id":req.body.assessor_ID},
                                    {
                                        $set :{
                                            "assessor.$.assessor_type" : req.body.assessor_type,
                                            "assessor.$.user_ID"         : req.body.user_ID
                                        }
                                    }
                                )
                        .exec()
                        .then(data=>{
                            console.log('data ',data);
                            if(data.nModified == 1){
                                res.status(200).json({message:"Assessor Edited"});
                            }else{
                                res.status(200).json({message:"Assessor Not Edited"});
                            }
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
        break;
        case 'remove'   :
            Assessments.updateOne(
                                    {_id : req.params.assessments_ID,"assessor._id":req.body.assessor_ID},
                                    {
                                        $pull:{
                                            assessor : {
                                                _id        : req.body.assessor_ID,
                                            }
                                        }
                                    }
                                )
            .exec()
            .then(data=>{
                console.log('data ',data);
                if(data.nModified == 1){
                    res.status(200).json({message:"Assessor Removed"});
                }else{
                    res.status(200).json({message:"Assessor Not Removed"});
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
            res.status(200).json({message:"Invalid Action"});
        break;
    }
}

exports.update_ownerID = (req,res,next)=>{
    Assessments .updateOne(
                                {
                                    "_id"                       : req.body.assessments_ID,
                                    "framework.controlBlock_ID" : req.body.controlBlock_ID,
                                    "framework.control_ID"      : req.body.control_ID,
                                },
                                {
                                    $set : {
                                        "framework.$.controlOwner_ID" : req.body.controlOwner_ID,
                                    }
                                }
                            )
                        .exec()
                        .then(data=>{
                            if(data.nModified == 1){
                                res.status(200).json({message:"controlOwner_ID Updated"})
                            }else{
                                res.status(200).json({message:"controlOwner_ID Not Updated"})
                            }
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
}

exports.delete_responsedocument = (req,res,next)=>{
    Assessments .updateOne(
        {
            "_id"                       : req.body.assessments_ID,
            "framework.controlBlock_ID" : req.body.controlBlock_ID,
            "framework.control_ID"      : req.body.control_ID,
        },
        {
            $set : {
                "framework.$.response.document" : [],
            }
        }
    )
    .exec()
    .then(data=>{
        if(data.nModified == 1){
            res.status(200).json({message:"Response Document Updated"})
        }else{
            res.status(200).json({message:"Response Document Not Updated"})
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}