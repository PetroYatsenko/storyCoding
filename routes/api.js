const express = require('express');
const router = express.Router();
const apiController = require('../controllers/api');
const passportConfig = require('../config/passport');

/**
 * API examples routes.
 */
router.get('/', apiController.getApi);

// Socials
router.get('/facebook', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);
router.get('/twitter', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getTwitter);
router.post('/twitter', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postTwitter);
router.get('/instagram', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getInstagram);

module.exports = router;

