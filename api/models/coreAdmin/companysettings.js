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
    companyLocationsInfo   : [
                                {
                                    location        : String,
                                    officeID      : Number,
                                    companyAddress  : String,
                                    companyPincode  : String,
                                    companyCity     : String,
                                    companyState    : String,
                                    companyCountry  : String,
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
    listofVendors          : [
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
    riskprofile            : String, //High , Meidum or Low 
    createdBy              : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt              : Date
});

module.exports = mongoose.model('companysettings',companysettingsSchema);
