const express = require("express");
const router = express.Router();

const projectsettingController = require('../../controllers/tprm/projectSettings');

router.post('/', projectsettingController.create_projectSettings);

router.get('/get/one/:type', projectsettingController.fetch_projectsettings);

router.get('/list', projectsettingController.list_projectsettings);

router.delete('/',projectsettingController.delete_projectsettings);

module.exports = router;