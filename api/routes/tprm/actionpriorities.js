const express 	= require("express");
const router 	= express.Router();

const ActionpriorityController = require('../../controllers/tprm/actionpriorities');

router.post('/', ActionpriorityController.create_actionpriority);

router.get('/list', ActionpriorityController.list_actionpriority);

router.get('/list/:company_ID', ActionpriorityController.list_actionpriority_company_ID);

router.get('/:actionpriority', ActionpriorityController.detail_actionpriority);

router.put('/',ActionpriorityController.update_actionpriority);

router.delete('/:actionpriority_ID',ActionpriorityController.delete_actionpriority);

router.delete('/',ActionpriorityController.delete_all_actionpriority);

router.get('/list/:user_ID', ActionpriorityController.list_actionpriority_userID);

module.exports = router;