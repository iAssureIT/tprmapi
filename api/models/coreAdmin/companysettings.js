const mongoose = require('mongoose');

const companysettingsSchema = mongoose.Schema({
	_id			           : mongoose.Schema.Types.ObjectId,
    companyId              : Number,
    companyName            : String,
    companyContactNumber   : String,
    companyMobileNumber    : String,
    companyEmail           : String,
    companyAltEmail        : String,
    logoFilename           : String,
    companyUniqueID        : String,
    companyLogo            : String,
    companywebsite         : String,
    companyLocationsInfo   : [
                                {
                                    location            : String,
                                    companyContactNum   : String,
                                    companybuilding     : String,
                                    companylandmark     : String,                                 
                                    companyAddress      : String,
                                    companyPincode      : String,
                                    companyCity         : String,
                                    companydistrict     : String,
                                    companytaluka       : String,
                                    companyState        : String,
                                    companyCountry      : String,
                                }
                            ],
    bankDetails             : [
                                {
                                    accHolderName : String,
                                    bankName      : String,
                                    branchName    : String,
                                    accNumber     : String,
                                    ifscCode      : String,
                                }
                            ],
    taxSettings             : [
                                {
                                    taxType         : String,
                                    applicableTax   : String,
                                    effectiveFrom   : String,
                                    effectiveTo     : String,
                                    createdAt       : Date,
                                }
                            ],
    listofClient            : [
                                {
                                    companyID       : String,
                                    company_ID      : String,
                                }
                             ],
    preferences            : [
                                {
                                    defaultpwdfornewuser   : String,
                                }
                             ],
    spocDetails            : {
                                    fullname        : String,
                                    emailId         : String,
                                    mobNumber       : String,
                                    designation     : String,
                                    user_ID         : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
                             },
    type                   : String, //Admin , Corporate or Vendor
    riskprofile            : String, //High , Meidum or Low 
    createdBy              : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt              : Date,
    creatorRole            : String,
});

module.exports = mongoose.model('companysettings',companysettingsSchema);
