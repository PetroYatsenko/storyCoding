var express = require('express');
var router = express.Router();
const practiceController = require('../controllers/practice');
const passportConfig = require('../config/passport');

router.get('/heroes', passportConfig.isAuthenticated, practiceController.getMonstersCollection);
router.get('/story_builder', passportConfig.isAuthenticated, practiceController.getStoryBuilder);
router.get('/story_builder/arrange', passportConfig.isAuthenticated, practiceController.arrangeStory);
router.post('/story_builder/save', passportConfig.isAuthenticated, practiceController.saveStory);
router.get('/tests/:test', passportConfig.isAuthenticated, practiceController.test);

module.exports = router;