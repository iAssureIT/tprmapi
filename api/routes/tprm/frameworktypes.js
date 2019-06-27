const express 	= require("express");
const router 	= express.Router();

const FrameworktypeController = require('../../controllers/tprm/frameworktypes');

router.post('/', FrameworktypeController.create_frameworktype);

router.get('/list', FrameworktypeController.list_frameworktype);

router.get('/:frameworktype', FrameworktypeController.detail_frameworktype);

router.put('/',FrameworktypeController.update_frameworktype);

router.delete('/:frameworktype_ID',FrameworktypeController.delete_frameworktype);

router.delete('/',FrameworktypeController.delete_all_frameworktype);



module.exports = router;