const mongoose	= require("mongoose");

const Country = require('../../models/tprm/countries');

exports.create_country = (req,res,next)=>{
    var countryData = req.body.country;
	Country.findOne({country:countryData.toLowerCase()})
		.exec()
		.then(data =>{
			if(data){
				return res.status(200).json({
					message: 'country already exists'
				});
			}else{
				const country = new Country({
                    _id             : new mongoose.Types.ObjectId(),
                    country          : countryData.toLowerCase(),
                    createdBy       : req.body.createdBy,
                    createdAt       : new Date(),

                });
                country.save()
                    .then(data=>{
                        res.status(200).json({message: "country Added",ID:data._id});
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

exports.list_country = (req,res,next)=>{
    Country.find()
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

exports.detail_country = (req,res,next)=>{
    var countryData = req.params.country;
    Country.findOne({country:countryData.toLowerCase()})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('country not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_country = (req,res,next)=>{
    var countryData = req.body.country;
    Country.findOne({country:countryData.toLowerCase()})
		.exec()
		.then(data =>{
			if(data){
				return res.status(200).json({
					message: 'country already exists'
				});
			}else{
				Country.updateOne(
                                    { _id:req.body.id},  
                                    {
                                        $set:{
                                            "country" : countryData.toLowerCase()
                                        }
                                    }
                                )
                                .exec()
                                .then(data=>{
                                    console.log('data ',data);
                                    if(data){
                                        res.status(200).json("country Updated");
                                    }else{
                                        res.status(401).json("country Not Found");
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

exports.delete_country = (req,res,next)=>{
    Country.deleteOne({_id:req.params.country_ID})
        .exec()
        .then(data=>{
            res.status(200).json("country deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.delete_all_country = (req,res,next)=>{
    Country.deleteMany({})
        .exec()
        .then(data=>{
            res.status(200).json("All countries deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
