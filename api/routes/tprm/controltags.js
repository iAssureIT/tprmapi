const express 	= require("express");
const router 	= express.Router();

const ControltagController = require('../../controllers/tprm/controltags');

router.post('/', ControltagController.create_controltag);

router.get('/list', ControltagController.list_controltag);

router.get('/:controltag', ControltagController.detail_controltag);

router.put('/',ControltagController.update_controltag);

router.delete('/:controltag_ID',ControltagController.delete_controltag);

router.delete('/',ControltagController.delete_all_controltag);



module.exports = router;