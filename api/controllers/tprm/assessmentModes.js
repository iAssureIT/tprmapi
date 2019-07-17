const mongoose	= require("mongoose");

const  AssessmentModes = require('../../models/tprm/assessmentMode');

exports.create_assessmentModes = (req,res,next)=>{
    var assessmentModesData = req.body.assessmentMode;
	AssessmentModes.findOne({assessmentMode:assessmentModesData.toLowerCase(),company_ID:req.body.company_ID})
		.exec()
		.then(data =>{
			if(data){
				return res.status(200).json({
					message: 'assessmentModes already exists'
				});
			}else{
				const assessmentModes = new AssessmentModes({
                    _id             : new mongoose.Types.ObjectId(),
                    assessmentMode  : assessmentModesData.toLowerCase(),
                    company_ID      : req.body.company_ID,
                    createdBy       : req.body.createdBy,
                    createdAt       : new Date(),

                });
                assessmentModes.save()
                    .then(data=>{
                        console.log('data ',data);
                        res.status(200).json({message:"assessmentModes Added",ID:data._id});
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
};

exports.list_assessmentModes = (req,res,next)=>{
    AssessmentModes.find()
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

exports.list_assessmentModes_company_ID = (req,res,next)=>{
    AssessmentModes.find({company_ID:req.params.company_ID})
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

exports.detail_assessmentModes = (req,res,next)=>{
    var assessmentModesData = req.params.assessmentModes;
    AssessmentModes.findOne({assessmentModes:assessmentModesData.toLowerCase()})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('assessmentModes not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_assessmentModes = (req,res,next)=>{
    var assessmentModesData = req.body.assessmentMode;
    AssessmentModes.findOne({assessmentMode:assessmentModesData.toLowerCase()})
		.exec()
		.then(data =>{
			if(data && data._id != req.body.id){
				return res.status(200).json({
					message: 'assessmentModes already exists'
				});
			}else{
				AssessmentModes.updateOne(
                                { _id:req.body.id},  
                                {
                                    $set:{
                                        "assessmentMode" : assessmentModesData.toLowerCase()
                                    }
                                }
                            )
                            .exec()
                            .then(data=>{
                                console.log('data ',data);
                                if(data){
                                    res.status(200).json("assessmentModes Updated");
                                }else{
                                    res.status(401).json("assessmentModes Not Found");
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

exports.delete_assessmentModes = (req,res,next)=>{
    AssessmentModes.deleteOne({_id:req.params.assessmentmodes_ID})
        .exec()
        .then(data=>{
            console.log('data ',data);
            if(data.deletedCount == 1){
                res.status(200).json("assessmentModes deleted");
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

exports.delete_all_assessmentModes = (req,res,next)=>{
    AssessmentModes.deleteMany({})
        .exec()
        .then(data=>{
            res.status(200).json("All assessmentModes deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
