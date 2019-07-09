const mongoose	= require("mongoose");

const Industrytype = require('../../models/tprm/industrytypes');

exports.create_industrytype = (req,res,next)=>{
    console.log('industrytype');
    var industrytypeData = req.body.industrytype;
    console.log('industrytypeData',industrytypeData);
    if(industrytypeData){
        Industrytype.findOne({industrytype:industrytypeData.toLowerCase()})
		.exec()
		.then(data =>{
			if(data){
				return res.status(200).json({
					message: 'Industry Type already exists'
				});
			}else{
				const industrytypes = new industrytype({
                    _id             : new mongoose.Types.ObjectId(),
                    industrytype    : industrytypeData.toLowerCase(),
                    company_ID      : req.body.company_ID,
                    createdBy       : req.body.user_ID,
                    createdAt       : new Date(),

                });
                industrytypes.save()
                    .then(data=>{
                        res.status(200).json({message:"Industry Type Added",ID:data._id});
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
};

exports.list_industrytype = (req,res,next)=>{
    Industrytype.find()
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

exports.list_industrytype_company = (req,res,next)=>{
    Industrytype.find({company_ID:req.params.company_ID})
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

exports.detail_industrytype = (req,res,next)=>{
    var industrytypeData = req.params.industrytype;
    Industrytype.findOne({industrytype:industrytypeData.toLowerCase()})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('Industry Type not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_industrytype = (req,res,next)=>{
    var industrytypeData = req.body.industrytype;
    Industrytype.findOne({industrytype:industrytypeData.toLowerCase()})
		.exec()
		.then(data =>{
			if(data && data._id !== req.body.id){
				return res.status(200).json({
					message: 'Industry Type already exists'
				});
			}else{
				Industrytype.updateOne(
                    { _id:req.body.id},  
                    {
                        $set:{
                            "industrytype" : industrytypeData.toLowerCase()
                        }
                    }
                )
                .exec()
                .then(data=>{
                    console.log('data ',data);
                    if(data){
                        res.status(200).json("Industry Type Updated");
                    }else{
                        res.status(401).json("Industry Type Not Found");
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

exports.delete_industrytype = (req,res,next)=>{
    Industrytype.deleteOne({_id:req.params.industrytype_ID})
        .exec()
        .then(data=>{
            res.status(200).json("Industry Type deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.delete_all_industrytype = (req,res,next)=>{
    Industrytype.deleteMany({})
        .exec()
        .then(data=>{
            res.status(200).json("All Industry Types deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
