const express = require("express");
const router = express.Router();
const checkAuth = require('../../middlerware/check-auth.js');
const projectsettingController = require('../../controllers/tprm/projectSettings');

router.post('/',checkAuth,projectsettingController.create_projectSettings);

router.get('/get/one/:type',checkAuth,projectsettingController.fetch_projectsettings);

router.get('/list',checkAuth,projectsettingController.list_projectsettings);

router.delete('/',checkAuth,projectsettingController.delete_projectsettings);

module.exports = router;