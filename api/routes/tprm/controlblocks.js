const express 	= require("express");
const router 	= express.Router();
const checkAuth = require('../../middlerware/check-auth.js');
const ControlBlockController = require('../../controllers/tprm/controlblocks');

router.post('/',ControlBlockController.create_controlblocks_framwork);

router.post('/subcontrolBlock',checkAuth,ControlBlockController.create_controlblocks_subcontrolblock);

router.post('/controlblockscount_for_admin',ControlBlockController.controlblockscount_for_admin);

// router.post('/duplicate_contorlblock',ControlBlockController.duplicate_controlBlocks);

router.get('/list',ControlBlockController.list_controlblocks);

router.get('/fetchcb',ControlBlockController.fetch_all_subcontrolblocks); 

router.get('/fetchcontrols',ControlBlockController.fetch_all_controls);

router.get('/list/:company_ID',checkAuth,ControlBlockController.list_controlblocks_company);

router.get('/list_except_ref/:company_ID',checkAuth,ControlBlockController.list_controlblocks_company_except_ref);

router.get('/company_blocks_count/:user_ID/:company_ID',checkAuth,ControlBlockController.controlblocks_count_of_count);

router.get('/controlblocks_count_of_comapanyUser/:company_ID/:user_ID/:riskpro_ID',ControlBlockController.controlblocks_count_of_comapanyUser);

router.post('/controlblocks_of_forall',ControlBlockController.controlblocks_of_forall);

router.get('/controlblocks_count_of_admin/:user_ID',checkAuth,ControlBlockController.controlblocks_count_of_admin);

router.get('/domain_specific/:domain_ID',ControlBlockController.fetch_specific_domain);

router.get('/detail_scb_control/:controlBlock_ID',ControlBlockController.fetch_subcb_control_details);

router.get('/:controlBlock_ID',ControlBlockController.detail_controlblocks);

router.put('/',ControlBlockController.update_basic_controlblocks);

router.put('/subcontrolblock/:action/:controlBlocks_ID',checkAuth,ControlBlockController.update_controlblock);

router.put('/control/:action/:controlBlocks_ID',checkAuth,ControlBlockController.update_control);

router.delete('/:controlBlock_ID',checkAuth,ControlBlockController.delete_controlblocks);

router.delete('/',ControlBlockController.delete_all_controlblocks);

module.exports = router;