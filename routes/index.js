const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');

router.get('/', homeController.index);
router.get('/user_agreement', homeController.userAgreement);
router.get('/payment/:account_id');

module.exports = router;
