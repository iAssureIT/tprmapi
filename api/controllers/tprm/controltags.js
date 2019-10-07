const mongoose	= require("mongoose");

const Controltags = require('../../models/tprm/controltags');

const User = require('../../models/coreAdmin/users');

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
            if(data){
                getData();
                async function getData(){
                    var returnData=[];
                    for(var j = 0 ; j < data.length ; j++){
                        var str = await titleCase(data[j].controltag);
                        returnData.push({
                            _id         : data[j]._id,
                            controltag  : str,
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
function getIdFromUser(ids){
    var user_IDs = ids;
    return new Promise(function(resolve,reject){
        User.findOne({"_id" : user_IDs[1]})
        .exec()
        .then(data=>{
            if(data){
                console.log("data",data);
                 if (data.profile) {
                    user_IDs.push(data.profile.company_ID);
                    resolve(user_IDs); 
                 }else{
                    resolve(user_IDs); 
                 }
            }else{
                resolve(user_IDs);
            }
        })
        .catch(err =>{
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });
    });
}

exports.fetch_controltag_for_cadmin_cuser = (req,res,next)=>{
    getUserData();
    async function getUserData(){
        if(req.body.role === "customer-admin"){
            var ids = req.body.ids;
        }else{
            var ids = await getIdFromUser(req.body.ids);
        }
        Controltags.find({company_ID:{$in: ids }})
        .exec()
        .then(data=>{
            if(data&&data.length>0){
                getData();
                async function getData(){
                    var returnData=[];
                    for(var j = 0 ; j < data.length ; j++){
                        var str = await titleCase(data[j].controltag);
                        returnData.push({
                            _id         : data[j]._id,
                            controltag  : str,
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
}