const express 	= require("express");
const router 	= express.Router();

const ControlBlockController = require('../../controllers/tprm/controlblocks');

router.post('/', ControlBlockController.create_controlblocks);

router.get('/list', ControlBlockController.list_controlblocks);

router.get('/list/:company_ID',ControlBlockController.list_controlblocks_company);

router.get('/:controlBlock_ID', ControlBlockController.detail_controlblocks);

router.put('/',ControlBlockController.update_basic_controlblocks);

router.put('/subcontrolblock/:action/:controlBlocks_ID',ControlBlockController.update_controlblock);

router.put('/control/:action/:controlBlocks_ID',ControlBlockController.update_control);

router.delete('/:controlBlock_ID',ControlBlockController.delete_controlblocks);

router.delete('/',ControlBlockController.delete_all_controlblocks);

module.exports = router;