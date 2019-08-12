const mongoose	= require("mongoose");

const Controltags = require('../../models/tprm/controltags');

exports.create_controltag = (req,res,next)=>{
    var controltagData = req.body.controltag;
	Controltags.findOne({controltag:controltagData.toLowerCase(),company_ID:req.body.company_ID})
		.exec()
		.then(data =>{
			if(data){
				return res.status(200).json({
					message: 'Control Tag already exists'
				});
			}else{
				const controltags = new Controltags({
                    _id             : new mongoose.Types.ObjectId(),
                    controltag      : controltagData.toLowerCase(),
                    createdBy       : req.body.createdBy,
                    creatorRole     : req.body.creatorRole,
                    company_ID      : req.body.company_ID,
                    createdAt       : new Date(),
                });
                controltags.save()
                    .then(data=>{
                        res.status(200).json({message: "Control tag Added",ID:data._id});
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

exports.list_controltag = (req,res,next)=>{
    Controltags.find()
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

exports.list_controltag_company = (req,res,next)=>{
    Controltags.find({company_ID:req.params.company_ID})
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

exports.detail_controltag = (req,res,next)=>{
    var controltagData = req.params.controltag;
    Controltags.findOne({controltag:controltagData.toLowerCase()})
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

exports.detail_controltagId = (req,res,next)=>{
    Controltags.findOne({_id:req.params.controltagId})
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

exports.update_controltag = (req,res,next)=>{
    var controltagData = req.body.controltag;
    Controltags.findOne({controltag:controltagData.toLowerCase(),company_ID:req.body.company_ID})
		.exec()
		.then(data =>{
			if(data && data._id !== req.body.id){
				return res.status(200).json({
					message: 'Control Tag already exists'
				});
			}else{
				Controltags.updateOne(
                    { _id:req.body.id},  
                    {
                        $set:{
                            "controltag" : controltagData.toLowerCase(),
                            // 'company_ID' : req.body.company_ID,
                        }
                    }
                )
                .exec()
                .then(data=>{
                    console.log('data ',data);
                    if(data){
                        res.status(200).json("Control Tag Updated");
                    }else{
                        res.status(401).json("Control Tag Not Found");
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

exports.delete_controltag = (req,res,next)=>{
    Controltags.deleteOne({_id:req.params.controltag_ID})
        .exec()
        .then(data=>{
            res.status(200).json("Control Tag deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.delete_all_controltag = (req,res,next)=>{
    Controltags.deleteMany({})
        .exec()
        .then(data=>{
            res.status(200).json("All Control Tags deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
