const express 	= require("express");
const router 	= express.Router();

const ControlBlockController = require('../../controllers/tprm/controlblocks');

router.post('/', ControlBlockController.create_controlblocks_framwork);

router.post('/subcontrolBlock',ControlBlockController.create_controlblocks_subcontrolblock);

router.post('/duplicate_contorlblock',ControlBlockController.duplicate_controlBlocks);

router.get('/list', ControlBlockController.list_controlblocks);

router.get('/fetchcb',ControlBlockController.fetch_all_subcontrolblocks);

router.get('/fetchcontrols',ControlBlockController.fetch_all_controls);

router.get('/list/:company_ID',ControlBlockController.list_controlblocks_company);

router.get('/company_blocks_count/:company_ID', ControlBlockController.controlblocks_count_of_count);

router.get('/domain_specific/:domain_ID',ControlBlockController.fetch_specific_domain);

router.get('/:controlBlock_ID', ControlBlockController.detail_controlblocks);

router.put('/',ControlBlockController.update_basic_controlblocks);

router.put('/subcontrolblock/:action/:controlBlocks_ID',ControlBlockController.update_controlblock);

router.put('/control/:action/:controlBlocks_ID',ControlBlockController.update_control);

router.delete('/:controlBlock_ID',ControlBlockController.delete_controlblocks);

router.delete('/',ControlBlockController.delete_all_controlblocks);

module.exports = router;