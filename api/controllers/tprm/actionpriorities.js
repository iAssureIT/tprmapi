const mongoose	= require("mongoose");

const  Actionpriority = require('../../models/tprm/actionpriorities');

exports.create_actionpriority = (req,res,next)=>{
    var actionpriorityData = req.body.actionpriority;
	Actionpriority.findOne({actionpriority:actionpriorityData.toLowerCase(),company_ID:req.body.company_ID})
		.exec()
		.then(data =>{
			if(data ){
				return res.status(200).json({
					message: 'actionpriority already exists'
				});
			}else{
				const actionpriority = new Actionpriority({
                    _id             : new mongoose.Types.ObjectId(),
                    actionpriority  : actionpriorityData.toLowerCase(),
                    company_ID      : req.body.company_ID,
                    createdBy       : req.body.createdBy,
                    createdAt       : new Date(),

                });
                actionpriority.save()
                    .then(data=>{
                        console.log('data ',data);
                        res.status(200).json({message:"actionpriority Added",ID:data._id});
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

exports.list_actionpriority = (req,res,next)=>{
    Actionpriority.find()
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

exports.list_actionpriority_company_ID = (req,res,next)=>{
    Actionpriority.find({company_ID:req.params.company_ID})
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

exports.detail_actionpriority = (req,res,next)=>{
    var actionpriorityData = req.params.actionpriority;
    Actionpriority.findOne({actionpriority:actionpriorityData.toLowerCase()})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('actionpriority not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_actionpriority = (req,res,next)=>{
    var actionprioritysData = req.body.actionpriority;
    Actionpriority.findOne({actionpriority:actionprioritysData.toLowerCase(),company_ID:req.body.company_ID})
		.exec()
		.then(data =>{
			if(data && data._id != req.body.id){
				return res.status(200).json({
					message: 'actionprioritys already exists'
				});
			}else{
				Actionpriority.updateOne(
                                { _id:req.body.id},  
                                {
                                    $set:{
                                        "actionpriority" : actionprioritysData.toLowerCase()
                                    }
                                }
                            )
                            .exec()
                            .then(data=>{
                                console.log('data ',data);
                                if(data){
                                    res.status(200).json("actionprioritys Updated");
                                }else{
                                    res.status(401).json("actionpriority Not Found");
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

exports.delete_actionpriority = (req,res,next)=>{
    Actionpriority.deleteOne({_id:req.params.actionpriority_ID})
        .exec()
        .then(data=>{
            console.log('data ',data);
            if(data.deletedCount == 1){
                res.status(200).json("actionpriority deleted");
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

exports.delete_all_actionpriority = (req,res,next)=>{
    Actionpriority.deleteMany({})
        .exec()
        .then(data=>{
            res.status(200).json("All actionpriority deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.list_actionpriority_userID = (req,res,next)=>{
    Actionpriority.find({createdBy:req.params.user_ID})
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
