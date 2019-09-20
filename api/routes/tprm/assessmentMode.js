const express 	= require("express");
const router 	= express.Router();
// const checkAuth = require('../../middlerware/check-auth.js');
const AssessmentModeController = require('../../controllers/tprm/assessmentModes');

router.post('/', AssessmentModeController.create_assessmentModes);

router.get('/list', AssessmentModeController.list_assessmentModes);

router.get('/list/:company_ID', AssessmentModeController.list_assessmentModes_company_ID);

router.get('/:assessmentmodes', AssessmentModeController.detail_assessmentModes);

router.put('/',AssessmentModeController.update_assessmentModes);

router.delete('/:assessmentmodes_ID',AssessmentModeController.delete_assessmentModes);

router.delete('/',AssessmentModeController.delete_all_assessmentModes);

module.exports = router;