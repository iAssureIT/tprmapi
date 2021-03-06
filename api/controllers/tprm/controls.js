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
                if(req.body.controlBlocks_ID){
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
                                // console.log('data ',data,' c ',req.body.controlBlocks_ID);
                                Controlblocks.updateOne(
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
                                        .then(cb=>{
                                            if(cb.nModified == 1){
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
                }else{
                    res.status(200).json({message:"Control Block Id is missing"});
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
    Control.findOne({_id:req.body.id})
		.exec()
		.then(data =>{
            if (data) {
                // console.log("data"+data+" "+data._id);
                // console.log("req.body.id",req.body.id);
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
               
            }else{
                return res.status(200).json({
                    message: 'Control not exists'
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
    Control.countDocuments({company_ID : { $in: [req.params.company_ID,req.params.user_ID ]}, ref_control_ID : { $exists : false }})
    // Control.find({company_ID : req.params.company_ID})
        .exec()
        .then(data=>{
            // console.log("data",data);
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
exports.controls_count_of_companyUser = (req,res,next)=>{
    Control.countDocuments({company_ID : { $in: [req.params.company_ID,req.params.user_ID,req.params.riskpro_ID]},ref_control_ID : { $exists : false }})
    // Control.find({company_ID : req.params.company_ID})
        .exec()
        .then(data=>{
            // console.log("data",data);
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
exports.controlscount_for_admin = (req,res,next)=>{
    Control.countDocuments({company_ID : { $in: req.body.ids},ref_control_ID : { $exists : false }})
    // Control.find({company_ID : req.params.company_ID})
        .exec()
        .then(data=>{
            // console.log("data",data);
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
exports.controls_count_of_admin = (req,res,next)=>{
    Control.countDocuments({company_ID : req.params.user_ID})
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

exports.duplicate_control = (req,res,next) =>{
    Control.findOne({_id:req.body.control_ID})
           .exec()
           .then(baseControl=>{
               if(baseControl){
                var newControl = new Control({
                    _id                     : new mongoose.Types.ObjectId(),
                    controlShort            : baseControl.controlShort, 
                    controlDesc             : baseControl.controlDesc,
                    controltag_ID           : baseControl.controltag_ID,
                    ref1                    : baseControl.ref1,
                    ref2                    : baseControl.ref2,
                    ref3                    : baseControl.ref3,
                    risk                    : baseControl.risk,
                    multiplier              : baseControl.multiplier,
                    mandatory               : baseControl.mandatory,
                    scored                  : baseControl.scored, 
                    controlBlocks_ID        : baseControl.controlBlocks_ID,
                    company_ID              : req.body.company_ID,
                    createdBy               : req.body.createdBy,
                    createdAt               : new Date(),
                });
                newControl  .save()
                            .then(control=>{
                                res.status(200).json({message:"Control Duplicated",ID:control._id})
                            })
                            .catch(err =>{
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });                 
               }else{
                   res.status(200).json({message:"Control Not found"})
               }
           })
           .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
}
function bulkupload_controls(newcontrol,controlBlock_ID){
    return new Promise(function(resolve,reject){
        Control.findOne({controlShort:newcontrol.controlShort})
                .exec()
                .then(baseControl=>{
                    if(!baseControl){
                        const control = new Control({
                            _id                     : new mongoose.Types.ObjectId(),
                            controlShort            : newcontrol.controlShort, 
                            controlDesc             : newcontrol.controlDesc,
                            controltag_ID           : newcontrol.controltag_ID,
                            ref1                    : newcontrol.ref1,
                            ref2                    : newcontrol.ref2,
                            ref3                    : newcontrol.ref3,
                            // risk                    : baseControl.risk,
                            multiplier              : newcontrol.multiplier,
                            mandatory               : newcontrol.mandatory,
                            scored                  : newcontrol.scored, 
                            controlBlocks_ID        : newcontrol.controlBlocks_ID,
                            company_ID              : newcontrol.company_ID,
                            createdBy               : newcontrol.createdBy,
                            createdAt               : new Date(),
                        });
                        control.save()
                            .then(data=>{
                                if (data) {
                                    Controlblocks.updateOne(
                                                {_id : controlBlock_ID},
                                                {
                                                    $push : {
                                                        controls : {
                                                            control_ID : data._id
                                                        }
                                                    }
                                                }
                                            )
                                    .exec()
                                    .then(cb=>{
                                        if(cb.nModified == 1){
                                            resolve(data._id);
                                        }else{
                                           resolve("Control not updated to control block");
                                        }
                                    })
                                    .catch(error =>{
                                        reject(error);
                                    });

                                }else{
                                    resolve("Control not added");
                                }
                                   
                            })
                            .catch(err =>{
                                console.log(err);
                                reject(err);
                            });
                               
                    }else{ //end of baseControl
                        resolve("Duplicate control short")
                    }
                })
                .catch(err =>{
                    console.log(err);
                    reject(err);
                });
    });
}

exports.control_Bulk_upload = (req,res,next)=>{
    var controls = req.body.data;
    var newControlLst = [];
    getControlData();
    async function getControlData(){
        for(var k = 0 ; k < controls.length ; k++){
            var newControl_ID = await bulkupload_controls(controls[k],req.body.controlBlock_ID);
            if(newControl_ID == "Control Not Found"){
                res.status(200).json({"message":"Control Not Found"});
            }else if (newControl_ID == "Duplicate control short") {
                res.status(200).json({"message":"Duplicate control short"});
            }else if (newControl_ID == "Control not updated to control block"){
                res.status(200).json({"message":"Control not updated to control block"});
            }else{
                newControlLst.push({"control_ID":newControl_ID});
            }
        }//listControls end
        if(k >= controls.length){
            res.status(200).json({"newControlLst": newControlLst, "controlBlock_ID" : req.body.controlBlock_ID,"message":"Controls Uploaded Successfully"})
        }
    }    

}

