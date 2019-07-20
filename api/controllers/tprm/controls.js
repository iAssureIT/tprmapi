const mongoose	= require("mongoose");

const Controlblocks = require('../../models/tprm/controlblocks');
const Control       = require('../../models/tprm/controls');

exports.create_control = (req,res,next)=>{
	Control.findOne({controlShort:req.body.controlShort})
		.exec()
		.then(data =>{
			if(data){
				return res.status(200).json({
					message: 'Control Short already exists'
				});
			}else{
				const control = new Control({
                    _id                     : new mongoose.Types.ObjectId(),
                    controlShort            : req.body.controlShort, 
                    controlDesc             : req.body.controlDesc,
                    controltag_ID           : req.body.controltag_ID,
                    ref1                    : req.body.ref1,
                    ref2                    : req.body.ref2,
                    ref3                    : req.body.ref3,
                    risk                    : req.body.risk,
                    multiplier              : req.body.multiplier,
                    mandatory               : req.body.mandatory,
                    scored                  : req.body.scored, 
                    controlBlocks_ID        : req.body.controlBlocks_ID,
                    company_ID              : req.body.company_ID,
                    createdBy               : req.body.createdBy,
                    createdAt               : new Date(),
                });
                control.save()
                    .then(data=>{
                        if(data){
                            console.log('data ',data,' c')
                            Controlblocks.update(
                                                {_id : req.body.controlBlocks_ID},
                                                {
                                                    $push : {
                                                        controls : {
                                                            control_ID : data._id
                                                        }
                                                    }
                                                }
                                            )
                                    .exec()
                                    .then(framework=>{
                                        if(framework.nModified == 1){
                                            res.status(200).json({message:"Control Added and Control Block updated",ID:data._id})
                                        }else{
                                            res.status(409).json({message:"Control Added and then something went wrong. "})
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
			}
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};

exports.list_control = (req,res,next)=>{
    Control.find()
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

exports.list_control_company = (req,res,next)=>{
    Control.find({company_ID:req.params.company_ID})
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

exports.detail_control = (req,res,next)=>{
    Control.findOne({_id:req.params.control_ID})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json({message:'Control not found'});
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_basic_control = (req,res,next)=>{
    Control.findOne({controlShort:req.body.controlShort})
		.exec()
		.then(data =>{
            if (data) {
                if(data._id != req.body.id){
                    // console.log("data"+data+" "+data._id);
                    // console.log("req.body.id",req.body.id);
                    return res.status(200).json({
                        message: 'Control Short already exists'
                    });
                }else{
                    Control.updateOne(
                        { _id:req.body.id},  
                        {
                            $set:{
                                'controlShort'            : req.body.controlShort,
                                'controlDesc'             : req.body.controlDesc,
                                'controltag_ID'           : req.body.controltag_ID,
                                'ref1'                    : req.body.ref1,
                                'ref2'                    : req.body.ref2,
                                'ref3'                    : req.body.ref3,
                                'risk'                    : req.body.risk,
                                'multiplier'              : req.body.multiplier,
                                'mandatory'               : req.body.mandatory,
                                'scored'                  : req.body.scored,
                                // 'company_ID'              : req.body.company_ID,
                            }
                        }
                    )
                    .exec()
                    .then(data=>{
                        console.log('data updated ',data);
                        if(data.nModified == 1){
                            res.status(200).json({message: "Control Updated"});
                        }else{
                            res.status(401).json({message:"Something went wrong"});
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
                return res.status(200).json({
                    message: 'Control Short not exists'
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

exports.delete_control = (req,res,next)=>{
    Control.deleteOne({_id:req.params.control_ID})
        .exec()
        .then(data=>{
            if(data.deletedCount == 1){
                res.status(200).json("Control deleted");
            }else{
                res.status(200).json("Control not Found");
            }
            
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.delete_all_control = (req,res,next)=>{
    Control.deleteMany({})
        .exec()
        .then(data=>{
            if(data.deletedCount > 0){
                res.status(200).json("All Controls deleted");
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
exports.controls_count_of_company = (req,res,next)=>{
    Control.find({company_ID : req.params.company_ID})
        .count()
        .exec()
        .then(data=>{
            console.log("data",data);
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json({message:'Controls not found'});
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

