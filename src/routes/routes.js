var express = require('express');
var router = express.Router()
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

// //setup route
const dataController = require('../controllers/test');
var signIn = require('../controllers/signIn');
var signUp = require('../controllers/signUp');
// var authorization = require('../middlewares/authorization');
// var account = require('../controllers/account');
// var predict = require('../controllers/predict');
// var project = require('../controllers/form');
// var record = require('../controllers/record');

router.post('/signUp',jsonParser, signUp.signUp);
router.post('/signIn',jsonParser, signIn.signIn);

// //middleware
// router.use(authorization);
// router.use('/account',account);
// router.use('/predict',predict);
// router.use('/project',project);
// router.use('/record',record);

//test

router.get('/', dataController.getData);

module.exports = router;