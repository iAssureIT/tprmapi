const mongoose	= require("mongoose");

const Domain = require('../../models/tprm/domains');

exports.create_domain = (req,res,next)=>{
    var domainData = req.body.domain;
	Domain.findOne({domain:domainData.toLowerCase(),company_ID:req.body.company_ID})
		.exec()
		.then(data =>{
			if(data){
				return res.status(200).json({
					message: 'Domain already exists'
				});
			}else{
				const domain = new Domain({
                    _id             : new mongoose.Types.ObjectId(),
                    domain          : domainData.toLowerCase(),
                    company_ID      : req.body.company_ID,
                    createdBy       : req.body.createdBy,
                    createdAt       : new Date(),

                });
                domain.save()
                    .then(data=>{
                        console.log('data ',data);
                        res.status(200).json({message:"Domain Added",ID:data._id});
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

exports.list_domain = (req,res,next)=>{
    Domain.find()
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

exports.list_domain_company_ID = (req,res,next)=>{
    Domain.find({company_ID:req.params.company_ID})
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

exports.detail_domain = (req,res,next)=>{
    var domainData = req.params.domain;
    Domain.findOne({domain:domainData.toLowerCase()})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('Domain not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_domain = (req,res,next)=>{
    var domainData = req.body.domain;
    Domain.findOne({domain:domainData.toLowerCase()})
		.exec()
		.then(data =>{
			if(data && data._id !== req.body.id){
				return res.status(200).json({
					message: 'Domain already exists'
				});
			}else{
				Domain.updateOne(
                                { _id:req.body.id},  
                                {
                                    $set:{
                                        "domain" : domainData.toLowerCase()
                                    }
                                }
                            )
                            .exec()
                            .then(data=>{
                                console.log('data ',data);
                                if(data){
                                    res.status(200).json("Domain Updated");
                                }else{
                                    res.status(401).json("Domain Not Found");
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

exports.delete_domain = (req,res,next)=>{
    Domain.deleteOne({_id:req.params.domain_ID})
        .exec()
        .then(data=>{
            res.status(200).json("Domain deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.delete_all_domain = (req,res,next)=>{
    Domain.deleteMany({})
        .exec()
        .then(data=>{
            res.status(200).json("All Domains deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        }); 
} 

exports.get_single_domain_ID = (req,res,next)=>{
    // console.log("req.body",req.params);
    Domain.findOne({"_id":req.params.domain_ID})
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
