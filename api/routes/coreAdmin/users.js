const express 	= require("express");
const router 	= express.Router();

const checkAuth     = require('../../middlerware/check-auth');

const UserController = require('../../controllers/coreAdmin/users');

router.get('/list', UserController.users_list); //Working

router.post('/', UserController.user_signup); //Working

router.post('/details',UserController.user_login); //Working

router.delete('/delete/:userID',UserController.user_delete);

router.delete('/delete',UserController.user_delete_all);

router.get('/:userID',UserController.user_details); //Working

router.put('/',UserController.user_update);  //Working

router.patch('/:rolestatus',UserController.user_change_role);  //Working


module.exports = router;