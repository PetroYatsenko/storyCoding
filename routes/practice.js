var express = require('express');
var router = express.Router();
const practiceController = require('../controllers/practice');
const passportConfig = require('../config/passport');

router.get('/heroes', passportConfig.isAuthenticated, practiceController.getMonstersCollection);
router.get('/story_builder', passportConfig.isAuthenticated, practiceController.getStoryBuilder);
router.get('/story_builder/arrange', passportConfig.isAuthenticated, practiceController.arrangeStory);
router.get('/tests/:test', passportConfig.isAuthenticated, practiceController.test);
router.get('/tests/save', passportConfig.isAuthenticated, practiceController.saveTest);
router.get('/diploma/story', passportConfig.isAuthenticated, practiceController.diploma);

router.post('/story_builder/save', passportConfig.isAuthenticated, practiceController.saveStory);
router.post('/tests/save', passportConfig.isAuthenticated, practiceController.saveTest);

module.exports = router;