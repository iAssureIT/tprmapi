const express 	= require("express");
const router 	= express.Router();

const CompanySettingController = require('../../controllers/coreAdmin/companysettingsss');

router.post('/', CompanySettingController.create_companysettings);

router.get('/list',CompanySettingController.list_companysettings);

router.get('/:companysettingsID', CompanySettingController.detail_companysettings);

router.patch('/:info/:action', CompanySettingController.update_companysettings);

router.delete('/:companysettingsID',CompanySettingController.delete_companysettings);


module.exports = router;