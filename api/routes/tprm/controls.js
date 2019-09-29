const express 	= require("express");
const router 	= express.Router();
const checkAuth = require('../../middlerware/check-auth.js');
const ControlController = require('../../controllers/tprm/controls');

router.post('/',ControlController.create_control);

router.post('/control_Bulk_upload',checkAuth,ControlController.control_Bulk_upload);

router.post('/controlscount_for_admin',ControlController.controlscount_for_admin);

router.get('/list',ControlController.list_control);

router.get('/list/:company_ID',ControlController.list_control_company);

router.post('/duplicateControl',ControlController.duplicate_control);

router.get('/company_controls_count/:user_ID/:company_ID',checkAuth,ControlController.controls_count_of_company);

router.get('/controls_count_of_admin/:user_ID',checkAuth,ControlController.controls_count_of_admin);

router.get('/controls_count_of_companyUser/:company_ID/:user_ID/:riskpro_ID',ControlController.controls_count_of_companyUser);

router.get('/:control_ID',ControlController.detail_control); 

router.put('/',ControlController.update_basic_control);

router.delete('/:control_ID',checkAuth,ControlController.delete_control);

router.delete('/',ControlController.delete_all_control);

module.exports = router;