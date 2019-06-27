const mongoose	= require("mongoose");

const Industrytag = require('../../models/tprm/industrytags');

exports.create_industrytag = (req,res,next)=>{
    var industrytagData = req.body.industrytag;
	Industrytag.findOne({industrytag:industrytagData.toLowerCase()})
		.exec()
		.then(data =>{
			if(data){
				return res.status(200).json({
					message: 'Industry Tag already exists'
				});
			}else{
				const industrytags = new Industrytag({
                    _id             : new mongoose.Types.ObjectId(),
                    industrytag     : industrytagData.toLowerCase(),
                    createdBy       : req.body.user_ID,
                    createdAt       : new Date(),

                });
                industrytags.save()
                    .then(data=>{
                        res.status(200).json({message:"Industry tag Added",ID:data._id});
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

exports.list_industrytag = (req,res,next)=>{
    Industrytag.find()
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

exports.detail_industrytag = (req,res,next)=>{
    var industrytagData = req.params.industrytag;
    Industrytag.findOne({industrytag:industrytagData.toLowerCase()})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('Industry tag not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_industrytag = (req,res,next)=>{
    var industrytagData = req.body.industrytag;
    Industrytag.findOne({industrytag:industrytagData.toLowerCase()})
		.exec()
		.then(data =>{
			if(data){
				return res.status(200).json({
					message: 'Industry Tag already exists'
				});
			}else{
				Industrytag.updateOne(
                    { _id:req.body.id},  
                    {
                        $set:{
                            "industrytag" : industrytagData.toLowerCase()
                        }
                    }
                )
                .exec()
                .then(data=>{
                    console.log('data ',data);
                    if(data){
                        res.status(200).json("Industry Tag Updated");
                    }else{
                        res.status(401).json("Industry Tag Not Found");
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

exports.delete_industrytag = (req,res,next)=>{
    Industrytag.deleteOne({_id:req.params.industrytag_ID})
        .exec()
        .then(data=>{
            res.status(200).json("Industry Tag deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.delete_all_industrytag = (req,res,next)=>{
    Industrytag.deleteMany({})
        .exec()
        .then(data=>{
            res.status(200).json("All Industry Tags deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
