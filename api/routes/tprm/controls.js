const express 	= require("express");
const router 	= express.Router();

const ControlController = require('../../controllers/tprm/controls');

router.post('/', ControlController.create_control);

router.get('/list', ControlController.list_control);

router.get('/list/:company_ID',ControlController.list_control_company);

router.get('/company_controls_count/:company_ID',ControlController.controls_count_of_company);

router.get('/:control_ID', ControlController.detail_control);

router.put('/',ControlController.update_basic_control);

router.delete('/:control_ID',ControlController.delete_control);

router.delete('/',ControlController.delete_all_control);

module.exports = router;