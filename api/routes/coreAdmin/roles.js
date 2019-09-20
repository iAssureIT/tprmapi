const express 	= require("express");
const router 	= express.Router();
const checkAuth     = require('../../middlerware/check-auth');
const RoleController = require('../../controllers/coreAdmin/roles');

router.post('/', RoleController.create_role);

router.get('/list', RoleController.list_role);

router.get('/:role', RoleController.detail_role);

router.put('/',RoleController.update_role);

router.delete('/:roleID',RoleController.delete_role);

router.delete('/',RoleController.delete_all_role);



module.exports = router;