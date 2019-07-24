const express 	= require("express");
const router 	= express.Router();

const CompanySettingController = require('../../controllers/coreAdmin/companysettings');

router.post('/', CompanySettingController.create_companysettings);

router.get('/list',CompanySettingController.listAll_companysettings);

router.get('/list/:user_ID/:user_type',CompanySettingController.list_companysettings);

router.post('/createclient',CompanySettingController.create_client);

router.get('/list/:companysettings_ID', CompanySettingController.detail_companysettings);

router.get('/details/:user_ID', CompanySettingController.details_ByUserId);

router.patch('/updatebasicadmin/:companysettings_ID',CompanySettingController.update_basicinfo_companysettings);

router.patch('/updatespocID/:company_ID/:user_ID',CompanySettingController.update_spoc_userID);

router.patch('/:info/:action', CompanySettingController.update_companysettings);

router.delete('/:companysettings_ID',CompanySettingController.delete_companysettings);

router.patch('/updateclient', CompanySettingController.update_created_client);

module.exports = router;