var express = require('express');
var router = express.Router();
const practiceController = require('../controllers/practice');
const passportConfig = require('../config/passport');

router.get('/heroes/:story', passportConfig.isAuthenticated, practiceController.getMonstersCollection);
router.get('/story_builder/:story/:hero', passportConfig.isAuthenticated, practiceController.getStoryBuilder);
router.get('/story_builder/arrange/:story/:hero/:title', passportConfig.isAuthenticated, practiceController.arrangeStory);
router.get('/story_builder/diploma', passportConfig.isAuthenticated, practiceController.arrangeDiploma);
router.get('/tests/:test', passportConfig.isAuthenticated, practiceController.test);
//router.get('/tests/save', passportConfig.isAuthenticated, practiceController.saveTest);
router.get('/diploma/story', passportConfig.isAuthenticated, practiceController.diploma);

router.post('/story_builder/save', passportConfig.isAuthenticated, practiceController.saveStory);
router.post('/tests/save', passportConfig.isAuthenticated, practiceController.saveTest);

module.exports = router;