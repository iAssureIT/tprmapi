const express 	= require("express");
const router 	= express.Router();

const NccriticalityController = require('../../controllers/tprm/nccriticality');

router.post('/', NccriticalityController.create_nccriticality);

router.get('/list', NccriticalityController.list_nccriticality);

router.get('/list_ncpriorityname/:company_ID',NccriticalityController.list_ncpriority_company_ID_name)

router.get('/list/:company_ID', NccriticalityController.list_nccriticality_company_ID);

router.get('/:nccriticality', NccriticalityController.detail_nccriticality);

router.put('/',NccriticalityController.update_nccriticality);

router.delete('/:nccriticality_ID',NccriticalityController.delete_nccriticality);
 
router.delete('/',NccriticalityController.delete_all_nccriticality);

module.exports = router;