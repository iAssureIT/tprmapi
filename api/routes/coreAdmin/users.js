const express 	= require("express");
const router 	= express.Router();

const checkAuth     = require('../../middlerware/check-auth');

const UserController = require('../../controllers/coreAdmin/users');

router.get('/list', UserController.users_list); //Working

router.get('/singleuser/:user_ID',UserController.list_cuser_framework_stage);

router.get('/count_framework_cuser/:countfor/:company_ID/:user_ID',UserController.count_framework_cuser);

router.get('/list/:company_ID/:role',UserController.users_list_company_role);

router.get('/list/companyadmin_users_framework_list/:user_ID',UserController.companyadmin_users_framework_list);

router.post('/', UserController.user_signup); //Working

router.post('/details',UserController.user_login); //Working

router.delete('/delete/:userID',UserController.user_delete);

router.delete('/delete',UserController.user_delete_all);

router.get('/:userID',UserController.user_details); //Working

router.put('/',UserController.user_update);  //Working

router.patch('/status',UserController.user_status_update);  //Working

// router.patch('/:rolestatus',UserController.user_change_role);  //Working
router.patch('/changeRole',UserController.user_change_role);  //Working

router.post('/resetpassword',UserController.user_resetpassword);  //Working

router.get('/list/:emailID', UserController.user_byEmailId); //Working


module.exports = router;