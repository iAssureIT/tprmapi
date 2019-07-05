const mongoose	= require("mongoose");

const Customertype = require('../../models/tprm/customertypes');

exports.create_customertype = (req,res,next)=>{
    var customertypeData = req.body.customertype;
	Customertype.findOne({customertype:customertypeData.toLowerCase()})
		.exec()
		.then(data =>{
			if(data){
				return res.status(200).json({
					message: 'Customer type already exists'
				});
			}else{
				const customertype = new Customertype({
                    _id             : new mongoose.Types.ObjectId(),
                    customertype    : customertypeData.toLowerCase(),
                    company_ID      : req.body.company_ID,
                    createdBy       : req.body.createdBy,
                    createdAt       : new Date(),

                });
                customertype.save()
                    .then(data=>{
                        res.status(200).json({message: "Customer type Added",ID:data._id});
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

exports.list_customertype = (req,res,next)=>{
    Customertype.find()
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

exports.list_customertype_company = (req,res,next)=>{
    Customertype.find({company_ID:req.params.company_ID})
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

exports.detail_customertype = (req,res,next)=>{
    var customertypeData = req.params.customertype;
    Customertype.findOne({customertype:customertypeData.toLowerCase()})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('Customer type not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_customertype = (req,res,next)=>{
    var customertypeData = req.body.customertype;
    Customertype.findOne({customertype:customertypeData.toLowerCase()})
                .exec()
                .then(data =>{
                    if(data && data._id !== req.body.id){
                        return res.status(200).json({
                            message: 'Customer type already exists'
                        });
                    }else{
                        Customertype.updateOne(
                                        { _id:req.body.id},  
                                        {
                                            $set:{
                                                "customertype" : customertypeData.toLowerCase()
                                            }
                                        }
                                    )
                                    .exec()
                                    .then(data=>{
                                        console.log('data ',data);
                                        if(data){
                                            res.status(200).json("Customer type Updated");
                                        }else{
                                            res.status(401).json("Customer type Not Found");
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

exports.delete_customertype = (req,res,next)=>{
    Customertype.deleteOne({_id:req.params.customertype_ID})
        .exec()
        .then(data=>{
            res.status(200).json("Customer type deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.delete_all_customertype = (req,res,next)=>{
    Customertype.deleteMany({})
        .exec()
        .then(data=>{
            res.status(200).json("All Customer types deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
