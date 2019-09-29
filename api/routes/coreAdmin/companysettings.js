const express 	= require("express");
const router 	= express.Router();
const checkAuth     = require('../../middlerware/check-auth');
const CompanySettingController = require('../../controllers/coreAdmin/companysettings');

router.post('/',checkAuth,CompanySettingController.create_companysettings);

router.get('/list',CompanySettingController.listAll_companysettings);

router.get('/list/:user_ID/:user_type',checkAuth,CompanySettingController.list_companysettings);

router.post('/createclient',checkAuth,CompanySettingController.create_client);

router.get('/list/:companysettings_ID',CompanySettingController.detail_companysettings);

router.get('/details/:user_ID',checkAuth,CompanySettingController.details_ByUserId);

router.patch('/updatebasicadmin/:companysettings_ID',checkAuth,CompanySettingController.update_basicinfo_companysettings);

router.patch('/updatespocID/:company_ID/:user_ID',CompanySettingController.update_spoc_userID);

router.patch('/:info/:action',CompanySettingController.update_companysettings);

router.delete('/:companysettings_ID',CompanySettingController.delete_companysettings);

router.patch('/updateclient',checkAuth,CompanySettingController.update_created_client);

router.get('/users_count/:user_ID/:user_type',checkAuth,CompanySettingController.users_count);

router.post('/user',checkAuth,CompanySettingController.userEmalId_byId_fornotification);

router.get('/users_assessmentCount/:user_ID',checkAuth,CompanySettingController.userDataVendor_assessment_Count);

router.get('/list/:user_ID/:user_type/:company_ID',checkAuth,CompanySettingController.list_userdata);

router.get('/adminData/:user_type',checkAuth,CompanySettingController.list_admindata);


module.exports = router; 