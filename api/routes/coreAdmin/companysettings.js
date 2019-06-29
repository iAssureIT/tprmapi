const express 	= require("express");
const router 	= express.Router();

const CompanySettingController = require('../../controllers/coreAdmin/companysettings');

router.post('/', CompanySettingController.create_companysettings);

router.get('/list',CompanySettingController.list_companysettings);

router.get('/:companysettings_ID', CompanySettingController.detail_companysettings);

router.patch('/:info/:action', CompanySettingController.update_companysettings);

router.delete('/:companysettings_ID',CompanySettingController.delete_companysettings);


module.exports = router;