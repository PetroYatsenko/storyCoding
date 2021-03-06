const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');
const passportConfig = require('../config/passport');

router.get('/', homeController.index);
router.get('/user_agreement', homeController.userAgreement);
router.get('/payment/:acc_type/:sum', passportConfig.isAuthenticated, homeController.paymentPage);

//router.post('/payment', passportConfig.isAuthenticated, homeController.paymentPage);

module.exports = router;
