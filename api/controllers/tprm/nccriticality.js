const mongoose	= require("mongoose");
var ObjectID = require('mongodb').ObjectID;

const  Nccriticality = require('../../models/tprm/nccriticality');

exports.create_nccriticality = (req,res,next)=>{
    var nccriticalityData = req.body.nccriticality;
	Nccriticality.findOne({nccriticality:nccriticalityData.toLowerCase(),company_ID:req.body.company_ID})
		.exec()
		.then(data =>{
			if(data ){
				return res.status(200).json({
					message: 'nccriticality already exists'
				});
			}else{
				const nccriticality = new Nccriticality({
                    _id             : new mongoose.Types.ObjectId(),
                    nccriticality  : nccriticalityData.toLowerCase(),
                    company_ID      : req.body.company_ID,
                    createdBy       : req.body.createdBy,
                    createdAt       : new Date(),

                });
                nccriticality.save()
                    .then(data=>{
                        console.log('data ',data);
                        res.status(200).json({message:"nccriticality Added",ID:data._id});
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

exports.list_nccriticality = (req,res,next)=>{
    Nccriticality.find()
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

exports.list_nccriticality_company_ID = (req,res,next)=>{
    Nccriticality.find({company_ID:req.params.company_ID})
        .exec()
        .then(data=>{
            if(data){
                getData();
                async function getData(){
                    var returnData=[];
                    for(var j = 0 ; j < data.length ; j++){
                        var str = await titleCase(data[j].nccriticality);
                        returnData.push({
                            _id         : data[j]._id,
                            nccriticality   : str,
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

exports.detail_nccriticality = (req,res,next)=>{
    var nccriticalityData = req.params.nccriticality;
    Nccriticality.findOne({nccriticality:nccriticalityData.toLowerCase()})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('nccriticality not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_nccriticality = (req,res,next)=>{
    var nccriticalitysData = req.body.nccriticality;
    Nccriticality.findOne({nccriticality:nccriticalitysData.toLowerCase(),company_ID:req.body.company_ID})
		.exec()
		.then(data =>{
			if(data && data._id != req.body.id){
				return res.status(200).json({
					message: 'nccriticalitys already exists'
				});
			}else{
				Nccriticality.updateOne(
                                { _id:req.body.id},  
                                {
                                    $set:{
                                        "nccriticality" : nccriticalitysData.toLowerCase()
                                    }
                                }
                            )
                            .exec()
                            .then(data=>{
                                console.log('data ',data);
                                if(data){
                                    res.status(200).json("nccriticalitys Updated");
                                }else{
                                    res.status(401).json("nccriticality Not Found");
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

exports.delete_nccriticality = (req,res,next)=>{
    Nccriticality.deleteOne({_id:req.params.nccriticality_ID})
        .exec()
        .then(data=>{
            console.log('data ',data);
            if(data.deletedCount == 1){
                res.status(200).json("nccriticality deleted");
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

exports.delete_all_nccriticality = (req,res,next)=>{
    Nccriticality.deleteMany({})
        .exec()
        .then(data=>{
            res.status(200).json("All nccriticality deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.list_ncpriority_company_ID_name = (req,res,next)=>{
    Nccriticality.aggregate([
                                {
                                    $match : {company_ID:new ObjectID(req.params.company_ID)}
                                },
                                {
                                    $group : {
                                        "_id"               : "$company_ID",
                                        "nccriticality"     : { $push : "$nccriticality"}
                                    }
                                },
                                {
                                    $project : {
                                        "_id"            : 0, 
                                        "nccriticality"  : 1
                                    }
                                }
                            ]
        )
        .exec()
        .then(data=>{
            if(data&&data.length>0){
                getData();
                async function getData(){
                    var returnData=[];
                    for(var j = 0 ; j < data[0].nccriticality.length ; j++){
                        var str = await titleCase(data[0].nccriticality[j]);
                        returnData.push(str);
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