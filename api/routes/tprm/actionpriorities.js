const express 	= require("express");
const router 	= express.Router();
const checkAuth = require('../../middlerware/check-auth.js');
const ActionpriorityController = require('../../controllers/tprm/actionpriorities');

router.post('/',checkAuth,ActionpriorityController.create_actionpriority);

router.get('/list',ActionpriorityController.list_actionpriority);

router.get('/list_actionpriorityname/:company_ID',ActionpriorityController.list_actionpriority_company_ID_name)

router.get('/list/:company_ID',checkAuth,ActionpriorityController.list_actionpriority_company_ID);

router.get('/:actionpriority',ActionpriorityController.detail_actionpriority);

router.put('/',checkAuth,ActionpriorityController.update_actionpriority);

router.delete('/:actionpriority_ID',checkAuth,ActionpriorityController.delete_actionpriority);

router.delete('/',ActionpriorityController.delete_all_actionpriority);

module.exports = router;