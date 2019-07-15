const mongoose	= require("mongoose");

const Framework = require('../../models/tprm/frameworks');

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
};

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
