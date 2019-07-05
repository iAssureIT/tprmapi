const mongoose	= require("mongoose");

const Frameworktype = require('../../models/tprm/frameworktypes');

exports.create_frameworktype = (req,res,next)=>{
    var frameworktypesData = req.body.frameworktype;
	Frameworktype.findOne({frameworktype:frameworktypesData.toLowerCase()})
		.exec()
		.then(data =>{
			if(data){
				return res.status(200).json({
					message: ' Framework types already exists'
				});
			}else{
				const frameworktype = new Frameworktype({
                    _id             : new mongoose.Types.ObjectId(),
                    frameworktype   : frameworktypesData.toLowerCase(),
                    company_ID      : req.body.company_ID,
                    createdBy       : req.body.createdBy,
                    createdAt       : new Date(),

                });
                frameworktype.save()
                    .then(data=>{
                        res.status(200).json({message : "Framework type Added",ID:data._id});
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

exports.list_frameworktype = (req,res,next)=>{
    Frameworktype.find()
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

exports.list_frameworktype_company = (req,res,next)=>{
    Frameworktype.find({company_ID:req.params.company_ID})
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

exports.detail_frameworktype = (req,res,next)=>{
    var frameworktypeData = req.params.frameworktype;
    Frameworktype.findOne({frameworktype:frameworktypeData.toLowerCase()})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('Framework type not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_frameworktype = (req,res,next)=>{
    var frameworktypeData = req.body.frameworktype;
    Frameworktype.findOne({frameworktype:frameworktypesData.toLowerCase()})
		.exec()
		.then(data =>{
			if(data && data._id !== req.body.id){
				return res.status(200).json({
					message: ' Framework types already exists'
				});
			}else{
				Frameworktype.updateOne(
                                    { _id:req.body.id},  
                                    {
                                        $set:{
                                            "frameworktype" : frameworktypeData.toLowerCase()
                                        }
                                    }
                                )
                                .exec()
                                .then(data=>{
                                    console.log('data ',data);
                                    if(data.nModified == 1){
                                        res.status(200).json("Framework type Updated");
                                    }else{
                                        res.status(401).json("Framework type Not Found");
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

exports.delete_frameworktype = (req,res,next)=>{
    Frameworktype.deleteOne({_id:req.params.frameworktype_ID})
        .exec()
        .then(data=>{
            res.status(200).json("Framework type deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.delete_all_frameworktype = (req,res,next)=>{
    Frameworktype.deleteMany({})
        .exec()
        .then(data=>{
            res.status(200).json("All framework types deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
