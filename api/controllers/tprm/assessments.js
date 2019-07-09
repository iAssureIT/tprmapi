const mongoose	= require("mongoose");

const Assessments      = require('../../models/tprm/assessments');
const Framework         = require('../../models/tprm/frameworks');
const ControlBlock      = require('../../models/tprm/controlblocks');
const Control           = require('../../models/tprm/controls');

exports.create_assessments = (req,res,next)=>{
    Framework   .findOne({_id:req.body.framework_ID})
                .exec()
                .then(framework=>{
                    if(framework){
                        if(framework.controlBlocks.length > 0 ){
                            var listcontrolblocks = framework.controlBlocks;
                            listcontrolblocks.map((cb,index)={
                                
                            });

                        }else{
                            res.status(409).json({message:"Control Blocks details not found"});    
                        }
                    }else{
                        res.status(409).json({message:"Framework not found"});
                    }
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });        
    // const assessments = new assessments({
    //     _id                 : new mongoose.Types.ObjectId(),
    //     framework_ID        : req.body.framework_ID, // Mandatory Field
    //     corporate_ID        : req.body.corporate_ID, // Corporate who is creating the assessment
    //     assessedParty_ID    : req.body.assessedParty_ID, // Vendor to whom it is to be assined
    //     frequency           : req.body.frequency, // Instead of _id frequency value is stored
    //     startDate           : req.body.startDate,
    //     endDate             : req.body.endDate,
    //     createdBy           : req.body.createdBy,
    //     createdAt           : new Date(),
    //     framework           : listFramework,
    // });
    // assessments.save()
    //     .then(data=>{
    //         console.log('data ',data);
    //         res.status(200).json({message:"Assessments Added",ID:data._id});
    //     })
    //     .catch(err =>{
    //         console.log(err);
    //         res.status(500).json({
    //             error: err
    //         });
    //     });
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
    Assessments.find({company_ID:req.params.company_ID})
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
    var assessmentsData = req.params.assessments;
    Assessments.findOne({assessments:assessmentsData.toLowerCase()})
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
    var assessmentssData = req.body.assessments;
    Assessments.findOne({assessments:assessmentssData.toLowerCase()})
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
