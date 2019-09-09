const mongoose	= require("mongoose");

const Riskfactors = require('../../models/tprm/riskfactors');

exports.create_riskfactor = (req,res,next)=>{
    var riskfactorData = req.body.riskfactor;
	Riskfactors.findOne({riskfactor:riskfactorData.toLowerCase(),company_ID:req.body.company_ID})
		.exec()
		.then(data =>{
			if(data){
				return res.status(200).json({
					message: 'risk factor already exists'
				});
			}else{
				const riskfactor = new Riskfactors({
                    _id             : new mongoose.Types.ObjectId(),
                    riskfactor      : riskfactorData.toLowerCase(),
                    company_ID      : req.body.company_ID,
                    createdBy       : req.body.createdBy,
                    createdAt       : new Date(),

                });
                riskfactor.save()
                    .then(data=>{
                        res.status(200).json({message : "risk factor Added",ID:data._id});
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

exports.list_riskfactor = (req,res,next)=>{
    Riskfactors.find()
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

exports.list_riskfactor_company = (req,res,next)=>{
    var company_ID = req.params.company_ID;
    Riskfactors.find({company_ID : company_ID})
        .exec()
        .then(data=>{
            if(data&&data.length>0){
                getData();
                async function getData(){
                    var returnData=[];
                    for(var j = 0 ; j < data.length ; j++){
                        var str = await titleCase(data[j].riskfactor);
                        returnData.push({
                            _id         : data[j]._id,
                            riskfactor  : str,
                            createdAt   : data[j].createdAt,
                            company_ID  : data[j].company_ID,
                            createdBy   : data[j].createdBy
                        });
                    }
                    if(j >= data.length){
                        res.status(200).json(returnData);
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

exports.detail_riskfactor = (req,res,next)=>{
    var riskfactorData = req.params.riskfactor;
    Riskfactors.findOne({riskfactor:riskfactorData.toLowerCase()})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('risk factor not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_riskfactor = (req,res,next)=>{
    var riskfactorData = req.body.riskfactor;
    Riskfactors.findOne({riskfactor:riskfactorData.toLowerCase(),company_ID:req.body.company_ID})
		.exec()
		.then(data =>{
			if(data && data._id !== req.body.id){
				return res.status(200).json({
					message: 'risk factor already exists'
				});
			}else{
				Riskfactors.updateOne(
                    { _id:req.body.id},  
                    {
                        $set:{
                            "riskfactor" : riskfactorData.toLowerCase()
                        }
                    }
                )
                .exec()
                .then(data=>{
                    console.log('data ',data);
                    if(data){
                        res.status(200).json("risk factor Updated");
                    }else{
                        res.status(401).json("risk factor Not Found");
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

exports.delete_riskfactor = (req,res,next)=>{
    Riskfactors.deleteOne({_id:req.params.riskfactor_ID})
        .exec()
        .then(data=>{
            res.status(200).json("risk factor deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.delete_all_riskfactor = (req,res,next)=>{
    Riskfactors.deleteMany({})
        .exec()
        .then(data=>{
            res.status(200).json("All risk factors deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
