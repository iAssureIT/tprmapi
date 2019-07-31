const mongoose	= require("mongoose");

const Framework         = require('../../models/tprm/frameworks');
const Controlblocks     = require('../../models/tprm/controlblocks');

function duplicate_controlBlocks(controlBlock){
    return new Promise(function(resolve,reject){
        Controlblocks.findOne({_id:controlBlock.controlBlocks_ID})
                .exec()
                .then(baseControlblock=>{
                    if(baseControlblock){
                        var newControlblocks = new Controlblocks({
                            _id                     : new mongoose.Types.ObjectId(), 
                            controlBlocksCode       : baseControlblock.controlBlocksCode,
                            controlBlockRef         : baseControlblock.controlBlockRef,
                            controlBlockName        : baseControlblock.controlBlockName,
                            controlBlockDesc        : baseControlblock.controlBlockDesc,
                            parentBlock             : baseControlblock.parentBlock,
                            domain_ID               : baseControlblock.domain_ID,
                            sequence                : controlBlock.sequence,
                            weightage               : baseControlblock.weightage,
                            company_ID              : controlBlock.company_ID,
                            createdBy               : controlBlock.createdBy,
                            createdAt               : new Date(),
                            subControlBlocks        : baseControlblock.subControlBlocks,
                            controls                : baseControlblock.controls
                        });
                        newControlblocks.save()
                                        .then(controlblock=>{
                                            console.log('dupicat controlblock ',controlblock._id);
                                            resolve(controlblock._id)
                                        })
                                        .catch(err =>{
                                            console.log(err);
                                            reject(err);
                                        });                 
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
exports.create_framework = (req,res,next)=>{
	Framework.findOne({frameworkname:req.body.frameworkname,version:req.body.version})
		.exec()
		.then(data =>{
			if(data){
				return res.status(200).json({
					message: 'Framework already exists'
				});
			}else{
				const framework = new Framework({
                    _id                 : new mongoose.Types.ObjectId(),
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
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
}

exports.create_Customize_framework = (req,res,next)=>{
    
    Framework   .findOne({_id:req.params.framework_ID}, {"_id":0})
                .exec()
                .then(FWDoc=>{
                    if(FWDoc){
                        fetchNewCB(FWDoc);
                        var newCBArray = [];
                        async function fetchNewCB(FWDoc){
                            console.log('FWDoc',FWDoc);
                            for(i = 0;i < FWDoc.controlBlocks.length; i++){
                                console.log('i ',i);
                                var controlBlock = {
                                    controlBlocks_ID : FWDoc._id,
                                    sequence         : req.body.sequence,
                                    company_ID       : req.body.company_ID,
                                    createdBy        : req.body.createdBy
                                };
                                if(controlBlock){
                                    var newCB = await duplicate_controlBlocks(controlBlock);
                                    newCBArray.push(newCB);
                                }
                            }
                            if(FWDoc.controlBlocks.length == newCBArray){
                                const framework = new Framework({
                                        _id                 : new mongoose.Types.ObjectId(),
                                        frameworktype       : FWDoc.frameworktype,
                                        frameworkname       : FWDoc.frameworkname,
                                        purpose             : FWDoc.purpose,
                                        domain_ID           : FWDoc.domain_ID,
                                        company_ID          : req.body.company_ID,
                                        createdBy           : req.body.createdBy, 
                                        ref_framework_ID    : FWDoc.ref_framework_ID,
                                        state               : FWDoc.state,
                                        stage               : FWDoc.stage,
                                        version             : FWDoc.version,
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
                        };
                    }
                    
                    // res.status(200).json(FWDoc);
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

exports.frameworks_count_of_company = (req,res,next)=>{
    Framework.find({company_ID : req.params.company_ID})
        .count()
        .exec()
        .then(data=>{
            console.log("data",data);
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