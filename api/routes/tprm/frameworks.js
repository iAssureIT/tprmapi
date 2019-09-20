const express 	= require("express");
const router 	= express.Router();
// const checkAuth = require('../../middlerware/check-auth.js');
const FrameworkController = require('../../controllers/tprm/frameworks');

router.post('/', FrameworkController.create_framework);

router.post('/create_Customize_framework/:framework_ID',FrameworkController.create_Customize_framework);

router.post('/list_framework_stage_customeradmin',FrameworkController.list_framework_stage_customeradmin);

router.post('/frameworks_count_for_cadmin',FrameworkController.frameworks_count_for_cadmin);

router.get('/list', FrameworkController.list_framework);

router.get('/list/:company_ID',FrameworkController.list_framework_company);

router.get('/:framework_ID', FrameworkController.detail_framework);

router.get('/stage_company/list/:company_ID/:stage/:frameworktype', FrameworkController.list_framework_stage);

router.get('/frameworks_count_of_companyUser/:company_ID/:user_ID/:riskpro_ID', FrameworkController.frameworks_count_of_companyUser);

router.get('/frameworks_count_of_admin/:user_ID',FrameworkController.frameworks_count_of_admin);

router.get('/company/list/:company_ID/:user_ID/:stage/:frameworktype', FrameworkController.list_allcustUserframework_stage);

router.get('/company_frameworks_count/:user_ID/:company_ID', FrameworkController.frameworks_count_of_company);

router.get('/frameworks_cb_details/:framework_ID',FrameworkController.fetch_framework_controlblockDetails);

router.put('/',FrameworkController.update_framework);

router.put('/state_stage',FrameworkController.update_framework_stage_state);

router.put('/controlblock/:action/:framework_ID',FrameworkController.update_controlblock);

router.delete('/:framework_ID',FrameworkController.delete_framework);

router.delete('/',FrameworkController.delete_all_framework);
 
module.exports = router;