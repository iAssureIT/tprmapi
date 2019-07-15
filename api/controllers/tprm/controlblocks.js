const mongoose	= require("mongoose");

const Controlblocks = require('../../models/tprm/controlblocks');
const Framwork      = require('../../models/tprm/frameworks');

exports.create_controlblocks_framwork = (req,res,next)=>{
	Controlblocks.findOne({controlBlockName:req.body.controlBlockName})
		.exec()
		.then(data =>{
			if(data){
				return res.status(200).json({
					message: 'Control Block Name already exists'
				});
			}else{ 
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
                            Controlblocks.update(
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
                                    .then(framework=>{
                                        if(framework.nModified == 1){
                                            res.status(200).json({message:"New Control Block created and Parent Control Block updated",ID:data._id})
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
                    console.log('data ',data);
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
    console.log('controlblock params ',req.params);
    switch(req.params.action){
        case 'add'      :
        console.log('add body',req.body);
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
                console.log('data ',data);
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
    console.log('control parmas ',req.params);
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
