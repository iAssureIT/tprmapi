const mongoose  = require("mongoose");
var request = require('request-promise');
var ObjectID = require('mongodb').ObjectID;
const globalVariable = require("../../../nodemon.js");
var moment = require('moment');
const Assessments = require('../../models/tprm/assessments');
const Framework = require('../../models/tprm/frameworks');
const Companysettings = require('../../models/coreAdmin/companysettings');

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
                                                        // console.log('assessmentCount',assessmentCount)
                                                        const assessment = new Assessments({
                                                            _id                : new mongoose.Types.ObjectId(),
                                                            corporate_ID       : req.body.corporate_ID,
                                                            assessedParty_ID   : req.body.assessedParty_ID,
                                                            assessmentName     : req.body.assessmentName,
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
                                                            controlBlocks      : lstcontrolblocks.controlBlocks, 
                                                            createdBy          : req.body.createdBy,
                                                            createdAt          : new Date(),
                                                        });
                                                        assessment.save()
                                                                .then(assessment=>{
                                                                    if(assessment){
                                                                        res.status(200).json({message:"Assessment Created",ID:assessment._id,assessedParty_ID:assessment.assessedParty_ID})
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
                                    // reject(err);
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
    Assessments.find({$or:[{corporate_ID:req.params.corporate_ID},{"assessor.user_ID":req.params.corporate_ID}]})
    .exec()
    .then(data=>{
        if(data&&data.length>0){
            getData();
            async function getData(){
                var returnData = [];
                for(var i = 0 ;i < data.length ; i++){
                    var partyName = await getAssessedPartyName(data[i].assessedParty_ID)
                    returnData.push({
                        _id: data[i]._id,
                        corporate_ID: data[i].corporate_ID,
                        assessedParty_ID: data[i].assessedParty_ID,
                        assessmentName  : data[i].assessmentName,
                        framework_ID: data[i].framework_ID,
                        assessmentID: data[i].assessmentID,
                        frequency: data[i].frequency,
                        startDate: data[i].startDate,
                        endDate: data[i].endDate,
                        purpose: data[i].purpose,
                        assessmentMode: data[i].assessmentMode,
                        assessmentStatus: data[i].assessmentStatus,
                        assessmentStages: data[i].assessmentStages,
                        assessor: data[i].assessor,
                        framework: data[i].framework,
                        createdBy: data[i].createdBy,
                        createdAt: data[i].createdAt,
                        assessedPartyName: partyName,
                    });
                }
                if(i >= data.length){
                    // console.log("returnData",returnData);
                    res.status(200).json(returnData);
                }
            }
        }else{
            res.status(404).json("Assessment Data Not Found"); 
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.list_assessments_assessedParty_ID = (req,res,next)=>{
    Assessments.find({$or:[{assessedParty_ID:req.params.assessedParty_ID},{"framework.controlOwner_ID":req.params.assessedParty_ID}]})
    .exec()
    .then(data=>{
       if(data&&data.length>0){
            getData();
            async function getData(){
                var returnData = [];
                for(var i = 0 ;i < data.length ; i++){
                    var customerName = await getCustomerName(data[i].corporate_ID);
                    var customerEmail = await getCustomerId(data[i].corporate_ID);
                    returnData.push({
                        _id: data[i]._id,
                        corporate_ID: data[i].corporate_ID,
                        assessedParty_ID: data[i].assessedParty_ID,
                        assessmentName  : data[i].assessmentName,
                        framework_ID: data[i].framework_ID,
                        assessmentID: data[i].assessmentID,
                        frequency: data[i].frequency,
                        startDate: data[i].startDate,
                        endDate: data[i].endDate,
                        purpose: data[i].purpose,
                        assessmentMode: data[i].assessmentMode,
                        assessmentStatus: data[i].assessmentStatus,
                        assessmentStages: data[i].assessmentStages,
                        assessor: data[i].assessor,
                        framework: data[i].framework,
                        createdBy:data[i].createdBy,
                        createdAt: data[i].createdAt,
                        customerName: customerName,
                        customerEmail : customerEmail,
                    });
                }
                if(i >= data.length){
                    // console.log("returnData",returnData);
                    res.status(200).json(returnData);
                }
            }
        }else{
            res.status(404).json("Assessment Data Not Found"); 
        }
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
                "assessmentStatus" : req.params.status,
                "completionDate" : req.params.status=='Published'?new Date():'',
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
                    // console.log('data ',data);
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
                        corporate_ID : 1,
                        framework_ID : 1,
                        assessmentName : 1,
                        createdBy : 1,
                        assessor : 1
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
                    var controlDesc = await fetch_controlShort(data[i].framework.control_ID);
                    var contorlBlockName = await fetch_controlBlockName(data[i].framework.controlBlock_ID);
                    var controlOwnerName = await fetch_controlOwnerName(data[i].framework.controlOwner_ID); 
                    var partyName = await getAssessedPartyName(data[i].assessedParty_ID)
                    
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
                        "corporate_ID":data[i].corporate_ID,
                        "assessmentName" :data[i].assessmentName,
                        "assessedPartyName" : partyName,
                        "createdBy"         : data[i].createdBy,
                        "assessor"          : data[i].assessor
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
                $match : {$or:[{'corporate_ID':new ObjectID(req.params.corporate_ID)},{"assessor.user_ID":new ObjectID(req.params.corporate_ID)}]}
            },
            {
                $project :{
                    _id       : 1,
                    framework : 1,
                    assessedParty_ID : 1,
                    corporate_ID : 1,
                    framework_ID : 1,
                    assessmentName : 1,
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
            var controlDesc = await fetch_controlShort(data[i].framework.control_ID);
            var contorlBlockName = await fetch_controlBlockName(data[i].framework.controlBlock_ID);
            var controlOwnerName = await fetch_controlOwnerName(data[i].framework.controlOwner_ID);	
            var partyName = await getAssessedPartyName(data[i].assessedParty_ID)
            
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
                "assessmentName"  : data[i].assessmentName,
                "corporate_ID":data[i].corporate_ID,
                "assessedPartyName" : partyName,
                "createdBy"         : data[i].createdBy
            });
        }
            // console.log('ncData',ncData);
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
            $match : {$or:[{'assessedParty_ID':new ObjectID(req.params.assessedParty_ID)},{"framework.controlOwner_ID":new ObjectID(req.params.assessedParty_ID)}]}
        },
        {
            $project :{
            _id       : 1,
            framework : 1,
            corporate_ID : 1,
            framework_ID : 1,
            assessedParty_ID : 1,
            endDate : 1,
            assessmentName : 1,
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
                var controlDesc = await fetch_controlShort(data[i].framework.control_ID);
                var contorlBlockName = await fetch_controlBlockName(data[i].framework.controlBlock_ID);
                var controlOwnerName = await fetch_controlOwnerName(data[i].framework.controlOwner_ID); 
                var customerName = await getCustomerName(data[i].corporate_ID)
                var customerEmail = await getCustomerId(data[i].corporate_ID)
                if(data[i].framework.nc.actionPlan && data[i].framework.nc.actionPlan.length > 0){
                	for (var j = 0; j < data[i].framework.nc.actionPlan.length; j++) {
                		ncData.push({
                    		"_id" : data[i]._id,
                            "assessedParty_ID" : data[i].assessedParty_ID,
                            "assessmentName"   : data[i].assessmentName,
                            "endDate" : data[i].endDate,
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
                    		"actionPlan" :data[i].framework.nc.actionPlan[j],
                            "customerName" :customerName,
                            "customerEmail" : customerEmail,
                            "createdBy"     : data[i].createdBy,
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
                    $match : {$or:[{'corporate_ID':new ObjectID(req.params.corporate_ID)},{"assessor.user_ID":new ObjectID(req.params.corporate_ID)}]}
                },
                {
                    $project :{
                        _id       : 1,
                        framework : 1,
                        assessedParty_ID : 1,
                        framework_ID : 1,
                        assessmentName : 1,
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
                var controlDesc = await fetch_controlShort(data[i].framework.control_ID);
                var contorlBlockName = await fetch_controlBlockName(data[i].framework.controlBlock_ID);
                var controlOwnerName = await fetch_controlOwnerName(data[i].framework.controlOwner_ID);	
                var partyName = await getAssessedPartyName(data[i].assessedParty_ID)
    
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
                            "assessmentName"  : data[i].assessmentName,
                    		"actionPlan" :data[i].framework.nc.actionPlan[j],
                            "assessedPartyName" : partyName,
                            "createdBy"         : data[i].createdBy,
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
                    assessmentName: 1,
                    createdBy : 1,
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
            var controlDesc = await fetch_controlShort(data[i].framework.control_ID);
            var contorlBlockName = await fetch_controlBlockName(data[i].framework.controlBlock_ID);
            var controlOwnerName = await fetch_controlOwnerName(data[i].framework.controlOwner_ID);	
            var partyName = await getAssessedPartyName(data[i].assessedParty_ID)

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
                		"actionPlan" :data[i].framework.nc.actionPlan[j],
                        "assessmentName" :data[i].assessmentName,
                        "assessedPartyName" : partyName,
                        "createdBy"          : data[i].createdBy,
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
	// console.log('req',req.params,req.body);
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
                                            $project : {
                                                            "count"         : { $size : "$framework.nc.actionPlan"},
                                                            "assessmentID"  : 1,
                                                        }
                                        },
                                        {
                                            $group  : {
                                                        "_id"   : "$assessmentID",
                                                        "count" : {"$sum" : "$count"}
                                                    }
                                        }
                                    ]
                        )
                        .exec()
                        .then(count_actionPlan=>{
                            console.log('count_actionPlan',count_actionPlan)
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
                                                                                actionID        : (count_actionPlan[0].count + 1)+'('+count_actionPlan[0]._id+')',
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
                                // res.status(200).json(count_actionPlan)
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
                            // console.log("assessmentData",assessmentData);
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
                                                        console.log("data",data);
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
                                        var newDocArray = []
                                        var actionTaken = '' 
                                        if(assessmentData.framework[i].nc.actionPlan&&assessmentData.framework[i].nc.actionPlan.length>0){
                                            var index = assessmentData.framework[i].nc.actionPlan.findIndex(x=>x._id == req.body.actionPlan_ID)
                                            if(index>=0){
                                                var actionTaken = assessmentData.framework[i].nc.actionPlan[index].actionTaken
                                                if(assessmentData.framework[i].nc.actionPlan[index].document&&assessmentData.framework[i].nc.actionPlan[index].document.length>0
                                                    &&req.body.document&&req.body.document.length>0){
                                                  var newDocArray = [...assessmentData.framework[i].nc.actionPlan[index].document,...req.body.document]  
                                                }else if(req.body.document&&req.body.document.length>0){
                                                  var newDocArray = req.body.document  
                                                }else if(assessmentData.framework[i].nc.actionPlan[index].document&&assessmentData.framework[i].nc.actionPlan[index].document.length>0){
                                                  var newDocArray = assessmentData.framework[i].nc.actionPlan[index].document  
                                                }
                                            }
                                        }
                                        // console.log('newDocArray',newDocArray)
                                        Assessments .updateOne(
                                                				{
                                                    				"_id"                           : req.params.assessments_ID,
                                                    				["framework."+i+".nc.actionPlan._id"]   : req.body.actionPlan_ID
                                                				},
                                                				{
                                                    				$set : {
                                                                				["framework."+i+".nc.actionPlan.$.status"]          : req.body.status, //Open
                                                                				["framework."+i+".nc.actionPlan.$.document"]        : newDocArray,
                                                                				["framework."+i+".nc.actionPlan.$.actionTaken"]     : req.body.actionTaken?req.body.actionTaken:actionTaken
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
    Assessments.findOne(
        {
            "_id"     : req.params.assessments_ID,
        }
    )
    .exec()
    .then(assessmentData=>{
        if(assessmentData.framework&&assessmentData.framework.length>0){
            for (var i = 0; i < assessmentData.framework.length; i++) {
                if(assessmentData.framework[i].controlBlock_ID==req.params.controlBlock_ID&&assessmentData.framework[i].control_ID==req.params.control_ID){
                    Assessments .updateOne(
                        {
                            "_id"   : req.params.assessments_ID,
                        },
                        {
                            $pull : {
                                ["framework."+i+".response.document"] : {"_id" : req.params.doc_ID},
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

exports.delete_actiondocument = (req,res,next)=>{
	// console.log('req',req.params);
	Assessments.findOne(
        {
            "_id"     : req.params.assessments_ID,
        }
    )
    .exec()
    .then(assessmentData=>{
    	// console.log('assessmentData',assessmentData);
    	if(assessmentData.framework&&assessmentData.framework.length>0){
    		for (var i = 0; i < assessmentData.framework.length; i++) {
    			if(assessmentData.framework[i].controlBlock_ID==req.params.controlBlock_ID&&assessmentData.framework[i].control_ID==req.params.control_ID){
    				Assessments .updateOne(
                        {
            				"_id"                                   : req.params.assessments_ID,
            				["framework."+i+".nc.actionPlan._id"]   : req.params.actionPlan_ID
                        },
            //             {
            // 				$set : {
            //     				["framework."+i+".nc.actionPlan.$.document"]          : [],
            // 				}
        				// }
                        {
                            $pull : {
                                ["framework."+i+".nc.actionPlan.$.document"] : {"_id" : req.params.doc_ID},
                            }
                        }
    				)
					.exec()
					.then(data=>{
						if(data.nModified == 1){
				            res.status(200).json({message:"Action Document Updated"})
				        }else{
				            res.status(200).json({message:"Action Document Not Updated"})
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
}

// function getAssessmentName(data){
//     return new Promise(function(resolve,reject){
//         Framework.findOne({_id:data})
//         .exec()
//         .then(assessmentData=>{
//             resolve(assessmentData.frameworkname);
//         })
//         .catch(err=>{
//             reject(err);
//         });
//     })
// }

function getAssessedPartyName(data){
    return new Promise(function(resolve,reject){
        Companysettings.findOne({_id:data})
        .exec()
        .then(companyData=>{
            resolve(companyData.companyName);
        })
        .catch(err=>{
            reject(err);
        });
    })
}
function getAssessedPartyId(data){
    return new Promise(function(resolve,reject){
        Companysettings.findOne({"spocDetails.user_ID" :data})
        .exec()
        .then(companyData=>{
            resolve(companyData._id);
        })
        .catch(err=>{
            reject(err);
        });
    })
}

function getCustomerName(data){
    return new Promise(function(resolve,reject){
        Companysettings.findOne({companyUniqueID:data})
        .exec()
        .then(companyData=>{
            resolve(companyData.companyName);
        })
        .catch(err=>{
            reject(err);
        });
    })
}
function getCustomerId(data){
    return new Promise(function(resolve,reject){
        Companysettings.findOne({companyUniqueID:data})
        .exec()
        .then(companyData=>{
            resolve(companyData.spocDetails.emailId);
        })
        .catch(err=>{
            reject(err);
        });
    })
}

exports.fetch_priority_actionplan = (req,res,next)=>{
    request({
            "method"    : "GET", 
            "url"       : "http://localhost:"+globalVariable.port+"/api/actionpriority/list_actionpriorityname/"+req.params.company_ID,
            "json"      : true,
            "headers"   : {
                            "User-Agent": "Test Agent"
                        }
        })
        .then(actionpriority=>{
            Assessments.aggregate( 
                                    [
                                        {
                                            $match : {corporate_ID:new ObjectID(req.params.company_ID)}
                                        },
                                        {
                                            $unwind : "$framework"
                                        },
                                        {
                                            $unwind : "$framework.nc.actionPlan"
                                        },
                                        {
                                            $project : {
                                                "actionpriority" : "$framework.nc.actionPlan.priority"
                                            }
                                        }
                                    ]
                        )
                        .exec()
                        .then(assessment=>{
                            var returnData = [];
                            var actionpriorities = actionpriority;
                            for (i = 0; i < actionpriorities.length; i++) {
                                var count = assessment.filter((assessment)=>{
                                    return assessment.actionpriority == actionpriorities[i]
                                 }).length;

                                returnData.push({
                                    "priority" : actionpriorities[i],
                                    "count"    : count
                                })
                            }
                                // console.log("Data ",returnData);
                            if(i >= actionpriorities.length){
                                res.header("Access-Control-Allow-Origin","*");

                                res.status(200).json(returnData);
                            }
                        })
                        .catch(err=>{
                            res.status(200).json({err:err});
                        });
            // res.status(200).json(actionpriority); 
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json(err);
        });
    // res.status(200).json("fetch_priority_actionplan");
};
exports.fetch_priority_NC = (req,res,next)=>{
    request({
            "method"    : "GET", 
            "url"       : "http://localhost:"+globalVariable.port+"/api/nccriticality/list_ncpriorityname/"+req.params.company_ID,
            "json"      : true,
            "headers"   : {
                            "User-Agent": "Test Agent"
                        }
        })
        .then(ncpriority=>{
            // console.log("ncpriority",ncpriority);
            Assessments.aggregate(
                                    [
                                        {
                                            $match : {corporate_ID:new ObjectID(req.params.company_ID)}
                                        },
                                        {
                                            $unwind : "$framework"
                                        },
                                        {
                                            $project : {
                                                "ncpriority" : "$framework.nc.Criticality"
                                            }
                                        }
                                        
                                    ]
                        )
                        .exec()
                        .then(assessment=>{
                           var finalAssessment = assessment.filter((assessment)=>{
                            return assessment.ncpriority;
                           })
                            var returnData = [];
                            var ncpriorities = ncpriority;
                            var i = 0 ;
                            for (i = 0; i < ncpriorities.length; i++) {
                                var count = finalAssessment.filter((assessment)=>{
                                    return assessment.ncpriority == ncpriorities[i]
                                 }).length;

                                returnData.push({
                                    "priority" : ncpriorities[i],
                                    "count"    : count
                                })
                            }
                                // console.log("Data ",returnData);
                            if(i >= ncpriorities.length){
                                res.header("Access-Control-Allow-Origin","*");
                                res.status(200).json(returnData);
                            }
                        })
                        .catch(err=>{
                            res.status(200).json({err:err});
                        });
            // res.status(200).json(actionpriority); 
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json(err);
        });
    // res.status(200).json("fetch_priority_actionplan");
};

exports.fetch_vendor_priority_actionplan = (req,res,next)=>{
    request({
            "method"    : "GET", 
            "url"       : "http://localhost:"+globalVariable.port+"/api/actionpriority/list_actionpriorityname/"+req.body.company_ID,
            "json"      : true,
            "headers"   : {
                            "User-Agent": "Test Agent"
                        }
        })
        .then(actionpriority=>{
            getcompanysettingData();
            async function getcompanysettingData(){
                var assessedPartyID = await getAssessedPartyId(req.body.userID);
                Assessments.aggregate(
                                        [
                                            {
                                                $match : {assessedParty_ID:new ObjectID(assessedPartyID)}
                                            },
                                            {
                                                $unwind : "$framework"
                                            },
                                            {
                                                $unwind : "$framework.nc.actionPlan"
                                            },
                                            {
                                                $project : {
                                                    "actionpriority" : "$framework.nc.actionPlan.priority"
                                                }
                                            }
                                        ]
                            )
                            .exec()
                            .then(assessment=>{
                                var returnData = [];
                                var actionpriorities = actionpriority;
                                for (i = 0; i < actionpriorities.length; i++) {
                                    var count = assessment.filter((assessment)=>{
                                        return assessment.actionpriority == actionpriorities[i]
                                     }).length;

                                    returnData.push({
                                        "priority" : actionpriorities[i],
                                        "count"    : count
                                    })
                                }
                                    // console.log("Data ",returnData);
                                if(i >= actionpriorities.length){
                                    res.header("Access-Control-Allow-Origin","*");

                                    res.status(200).json(returnData);
                                }
                            })
                            .catch(err=>{
                                res.status(200).json({err:err});
                            });
                // res.status(200).json(actionpriority); 
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json(err);
            });
       
    // res.status(200).json("fetch_priority_actionplan");
};

exports.fetch_assessment_bystages = (req,res,next)=>{
    getcompanysData();
    async function getcompanysData(){
    var assessedPartyID = await getAssessedPartyId(req.body.userID);
    Assessments.find({"assessedParty_ID" : assessedPartyID})
               .exec()
                .then(assessment=>{
                    var returnData = [];
                    var assessmentStages = req.body.assessmentStages;
                    for (i = 0; i < assessmentStages.length; i++) {
                        var count = assessment.filter((assessment)=>{
                            return assessment.assessmentStages == assessmentStages[i]
                         }).length;

                        returnData.push({
                            "assessmentStage" : assessmentStages[i],
                            "count"    : count
                        })
                    }
                        // console.log("Data ",returnData);
                    if(i >= assessmentStages.length){
                        res.status(200).json(returnData);
                    }
                })
                .catch(err=>{
                    res.status(200).json({err:err});
                });
                // res.status(200).json(actionpriority); 
    }
                
};
exports.sent_Actionplan_mail = (req,res,next) =>{
    Assessments.find()
    .exec() 
    .then(data=>{
        setNCDate();
        async function setNCDate(){
            for(i=0;i<data.length;i++){
                if(data[i].framework&&data[i].framework.length>0){
                    for (var k = 0; k < data[i].framework.length; k++) {
                        if(data[i].framework[k].nc.actionPlan&&data[i].framework[k].nc.actionPlan.length>0){
                            for (var j = 0; j < data[i].framework[k].nc.actionPlan.length; j++) {
                                if(data[i].framework[k].nc.actionPlan[j].status&&data[i].framework[k].nc.actionPlan[j].status!='Published'&&data[i].framework[k].nc.actionPlan[j].status!='Accepted'){
                                    const date1 = new Date();
                                    console.log("date1",date1);
                                    console.log("data[i].framework[k].nc.actionPlan[j].dueDate",data[i].framework[k].nc.actionPlan[j].dueDate);
                                    const date2 = new Date(data[i].framework[k].nc.actionPlan[j].dueDate);
                                    const diffTime = Math.abs(date2 - date1);
                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                                    console.log('diffDays===',diffDays)
                                    if(diffDays==3||diffDays==-1){
                                      var endDate = moment(data[i].framework[k].nc.actionPlan[j].dueDate).format('DD/MM/YYYY')
                                      Companysettings.findOne({'_id':data[i].assessedParty_ID})
                                        .exec()
                                        .then(user=>{
                                            // console.log('user',user);
                                            if(user){
                                                if (user.spocDetails) {
                                                    var subject = 'Complete Action Plan';
                                                    var mail    = 'Hello,<br><br>Action plan due on '+endDate+' is <b>pending</b> which was assigned to you by '+user.companyName+'. <br><br>Regards,<br>Team Risk Pro';;
                                                    var email   = user.spocDetails.emailId;
                                                    res.header("Access-Control-Allow-Origin","*");
                                                    request({
                                                        "method"    : "POST", 
                                                        "url"       : "http://localhost:"+globalVariable.port+"/send-email",
                                                        "body"      : {
                                                                            "email"     : email,
                                                                            "subject"   : subject,
                                                                            "text"      : "WOW Its done",
                                                                            "mail"      : mail
                                                                        },
                                                        "json"      : true,
                                                        "headers"   : {
                                                                        "User-Agent": "Test App"
                                                                    }
                                                    })
                                                    .then((sentemail)=>{
                                                        if(i >= data.length){
                                                            res.status(200).json({message:"Mail Sent successfully"});
                                                        }
                                                    })
                                                    .catch((err) =>{
                                                        console.log("call to api",err);
                                                        res.status(500).json({
                                                            error: err
                                                        });
                                                    });
                                                }

                                            }else{
                                                res.status(404).json("User Not Found");
                                            }
                                        })
                                        .catch(err=>{
                                            console.log('update user status error ',err);
                                            res.status(500).json({
                                                error:err
                                            });
                                        });  
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
}