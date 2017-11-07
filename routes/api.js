const express = require('express');
const multer = require('multer');
const router = express.Router();
const apiController = require('../controllers/api');
const passportConfig = require('../config/passport');
const path = require('path');
const upload = multer({ dest: path.join(__dirname, 'uploads') });

/**
 * API examples routes.
 */
router.get('/', apiController.getApi);
router.get('/lastfm', apiController.getLastfm);
router.get('/nyt', apiController.getNewYorkTimes);
router.get('/aviary', apiController.getAviary);
router.get('/steam', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getSteam);
router.get('/stripe', apiController.getStripe);
router.post('/stripe', apiController.postStripe);
router.get('/scraping', apiController.getScraping);
router.get('/twilio', apiController.getTwilio);
router.post('/twilio', apiController.postTwilio);
router.get('/clockwork', apiController.getClockwork);
router.post('/clockwork', apiController.postClockwork);
router.get('/foursquare', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFoursquare);
router.get('/tumblr', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getTumblr);
router.get('/facebook', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);
router.get('/github', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getGithub);
router.get('/twitter', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getTwitter);
router.post('/twitter', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postTwitter);
router.get('/linkedin', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getLinkedin);
router.get('/instagram', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getInstagram);
router.get('/paypal', apiController.getPayPal);
router.get('/paypal/success', apiController.getPayPalSuccess);
router.get('/paypal/cancel', apiController.getPayPalCancel);
router.get('/lob', apiController.getLob);
router.get('/upload', apiController.getFileUpload);
router.post('/upload', upload.single('myFile'), apiController.postFileUpload);
router.get('/pinterest', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getPinterest);
router.post('/pinterest', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postPinterest);
router.get('/google-maps', apiController.getGoogleMaps);

module.exports = router;

