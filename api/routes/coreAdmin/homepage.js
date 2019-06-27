const express 	= require("express");
const router 	= express.Router();

// const HomePageController = require('../controllers/homepage');

router.get('/', (req, res, next) => {
	res.status(200).json("Welcome to TPRM API");
});