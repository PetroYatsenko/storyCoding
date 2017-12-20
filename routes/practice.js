var express = require('express');
var router = express.Router();
const practiceController = require('../controllers/practice');
const passportConfig = require('../config/passport');

router.get('/heroes', passportConfig.isAuthenticated, practiceController.getHeroes);

router.get('/story_builder', passportConfig.isAuthenticated, practiceController.getLoopBuilder);

router.get('/story_builder/arrange', passportConfig.isAuthenticated, practiceController.arrangeStory);

router.post('story_builder/save', passportConfig.isAuthenticated, practiceController.saveStory);

module.exports = router;