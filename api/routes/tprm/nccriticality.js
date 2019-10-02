const express 	= require("express");
const router 	= express.Router();
const checkAuth = require('../../middlerware/check-auth.js');
const NccriticalityController = require('../../controllers/tprm/nccriticality');

router.post('/',checkAuth,NccriticalityController.create_nccriticality);
 
router.get('/list',checkAuth,NccriticalityController.list_nccriticality);

router.get('/list_ncpriorityname/:company_ID',NccriticalityController.list_ncpriority_company_ID_name)

router.get('/list/:company_ID',checkAuth,NccriticalityController.list_nccriticality_company_ID);

router.get('/:nccriticality',checkAuth,NccriticalityController.detail_nccriticality);

router.put('/',checkAuth,NccriticalityController.update_nccriticality);

router.delete('/:nccriticality_ID',checkAuth,NccriticalityController.delete_nccriticality);
 
router.delete('/',checkAuth,NccriticalityController.delete_all_nccriticality);

module.exports = router;